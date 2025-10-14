import { z } from "zod";

const querySchema = z.object({
  codes: z.union([
    z.string().length(3).toUpperCase(),
    z.string().length(3).toUpperCase().array(),
  ]),
  view: z.enum(["grid", "map"]).optional().default("grid"),
});

export function useSearchQueryParams() {
  const route = useRoute();

  const iataCodes = computed(() => {
    const validationResult = querySchema.safeParse(route.query);
    if (validationResult.error) {
      return [];
    }
    if (typeof validationResult.data.codes == "string") {
      return [validationResult.data.codes];
    }
    return validationResult.data.codes;
  });

  const activeView = computed(() => {
    const validationResult = querySchema.safeParse(route.query);
    return validationResult.success ? validationResult.data.view : "map";
  });

  function setView(view: z.infer<typeof querySchema>["view"]) {
    return navigateTo({
      path: "/search",
      query: {
        ...route.query,
        view,
      },
    });
  }

  function addAirport(airportSearchInput: string) {
    if (airportSearchInput && airportSearchInput.length === 3) {
      const newIataCodes = [
        ...iataCodes.value,
        airportSearchInput.toUpperCase(),
      ];
      return navigateTo({
        path: "/search",
        query: {
          codes: newIataCodes,
          view: activeView.value,
        },
      });
    }
  }

  function removeAirport(codeToRemove: string) {
    const newIataCodes = iataCodes.value.filter(
      (code) => code !== codeToRemove
    );
    return navigateTo({
      path: "/search",
      query: {
        codes: newIataCodes,
        view: activeView.value,
      },
    });
  }

  return {
    activeView,
    iataCodes,
    addAirport,
    removeAirport,
    setView,
  };
}
