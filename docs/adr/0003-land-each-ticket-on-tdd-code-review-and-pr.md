# Land each ticket on tdd, code-review, and pr

The landing skills build with `tdd`, review with `code-review`, and write PR bodies with `pr`, rather than running mattpocock's `implement` or `implement-spec`. Those two are user-invoked, so other skills can't reach them, and `implement-spec` gathers every ticket on one integration branch reviewed once at the end, where landing merges each ticket to the default branch as soon as its own review and CI pass. Don't route landing back through `implement-spec`: its branch, PR, and review model are what this replaces.
