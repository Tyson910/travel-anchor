export default defineAppConfig({
	// https://ui.nuxt.com/getting-started/theme#design-system
	ui: {
		colors: {
			primary: "emerald",
			neutral: "slate",
		},
		input: {
			slots: {
				root: "w-full",
			},
			variants: {
				size: {
					xs: {
						// prevent safari zoom in
						base: "text-base",
					},
					sm: {
						// prevent safari zoom in
						base: "text-base",
					},
					md: {
						// prevent safari zoom in
						base: "text-base",
					},
					lg: {
						// prevent safari zoom in
						base: "text-base",
					},
				},
			},
		},
		textarea: {
			slots: {
				root: "w-full",
				variants: {
					size: {
						xs: {
							// prevent safari zoom in
							base: "text-base",
						},
						sm: {
							// prevent safari zoom in
							base: "text-base",
						},
						md: {
							// prevent safari zoom in
							base: "text-base",
						},
						lg: {
							// prevent safari zoom in
							base: "text-base",
						},
					},
				},
			},
		},
		select: {
			slots: {
				base: "w-full",
				variants: {
					size: {
						xs: {
							// prevent safari zoom in
							base: "text-base",
						},
						sm: {
							// prevent safari zoom in
							base: "text-base",
						},
						md: {
							// prevent safari zoom in
							base: "text-base",
						},
						lg: {
							// prevent safari zoom in
							base: "text-base",
						},
					},
				},
			},
		},
		inputMenu: {
			slots: {
				base: "w-full",
				variants: {
					size: {
						xs: {
							// prevent safari zoom in
							base: "text-base",
						},
						sm: {
							// prevent safari zoom in
							base: "text-base",
						},
						md: {
							// prevent safari zoom in
							base: "text-base",
						},
						lg: {
							// prevent safari zoom in
							base: "text-base",
						},
					},
				},
			},
		},
	},
});
