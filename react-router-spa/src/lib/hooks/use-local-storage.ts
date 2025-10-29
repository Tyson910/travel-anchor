import type { StandardSchemaV1 } from "../standard-schema-types";

import { useCallback, useEffect, useSyncExternalStore } from "react";

// heavily inspired by https://github.com/uidotdev/usehooks

function dispatchStorageEvent(key: string, newValue: string | null) {
	window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

function setLocalStorageItem<T>(key: string, value: T): void {
	const stringifiedValue = JSON.stringify(value);
	window.localStorage.setItem(key, stringifiedValue);
	dispatchStorageEvent(key, stringifiedValue);
}

function removeLocalStorageItem(key: string): void {
	window.localStorage.removeItem(key);
	dispatchStorageEvent(key, null);
}

function getLocalStorageItem(key: string): string | null {
	return window.localStorage.getItem(key);
}

function validateAndParseStoredValue<T extends StandardSchemaV1>(
	schema: T,
	storedValue: string | null,
): StandardSchemaV1.InferOutput<T> | null {
	if (storedValue === null) {
		return null;
	}

	try {
		const parsedValue = JSON.parse(storedValue);
		const validationResult = schema["~standard"].validate(parsedValue);

		if (validationResult instanceof Promise) {
			throw new Error("Async validation is not supported in localStorage");
		}

		if (validationResult.issues) {
			console.warn("Stored value failed validation:", validationResult.issues);
			return null;
		}

		return validationResult.value;
	} catch (error) {
		console.warn("Failed to parse or validate stored value:", error);
		return null;
	}
}

function useLocalStorageSubscribe(
	callback: (event: StorageEvent) => void,
): () => void {
	window.addEventListener("storage", callback);
	return () => window.removeEventListener("storage", callback);
}

function getLocalStorageServerSnapshot(): never {
	throw new Error("useLocalStorage is a client-only hook");
}

export function useLocalStorage<T extends StandardSchemaV1>(
	key: string,
	initialValue: StandardSchemaV1.InferInput<T>,
	schema: T,
): [
	StandardSchemaV1.InferOutput<T>,
	(
		value:
			| StandardSchemaV1.InferOutput<T>
			| ((
					prev: StandardSchemaV1.InferOutput<T>,
			  ) => StandardSchemaV1.InferOutput<T>),
	) => void,
];

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void];

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	schema?: T extends StandardSchemaV1 ? T : never,
) {
	const getSnapshot = () => getLocalStorageItem(key);

	const store = useSyncExternalStore(
		useLocalStorageSubscribe,
		getSnapshot,
		getLocalStorageServerSnapshot,
	);

	const setState = useCallback(
		(v: T | ((prev: T) => T)) => {
			try {
				let nextState: T;

				if (typeof v === "function") {
					const currentValue = schema
						? (validateAndParseStoredValue(schema, store) ?? initialValue)
						: store
							? JSON.parse(store)
							: initialValue;
					nextState = (v as (prev: T) => T)(currentValue);
				} else {
					nextState = v;
				}

				// Validate the next state if schema is provided
				if (schema) {
					const validationResult = schema["~standard"].validate(nextState);
					if (validationResult instanceof Promise) {
						throw new Error(
							"Async validation is not supported in localStorage",
						);
					}
					if (validationResult.issues) {
						console.warn(
							"State update failed validation:",
							validationResult.issues,
						);
						return;
					}
				}

				if (nextState === undefined || nextState === null) {
					removeLocalStorageItem(key);
				} else {
					setLocalStorageItem(key, nextState);
				}
			} catch (e) {
				console.warn(e);
			}
		},
		[key, store, schema, initialValue],
	);

	useEffect(() => {
		const storedValue = getLocalStorageItem(key);

		if (storedValue === null && typeof initialValue !== "undefined") {
			setLocalStorageItem(key, initialValue);
		} else if (schema && storedValue !== null) {
			// Validate existing stored value on mount
			const validatedValue = validateAndParseStoredValue(schema, storedValue);
			if (validatedValue === null) {
				// If validation fails, replace with initial value
				setLocalStorageItem(key, initialValue);
			}
		}
	}, [key, initialValue, schema]);

	const currentValue = schema
		? (validateAndParseStoredValue(schema, store) ?? initialValue)
		: store
			? JSON.parse(store)
			: initialValue;

	return [currentValue, setState];
}
