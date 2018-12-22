# markdown-js

## Status: Deprecated

This library is not maintained please consider using [markdown-it][], [marked][]
or some other well maintained package instead.

Origianlly library contained [Showdown](http://attacklab.net/showdown/) packaged for node/npm as in early days there was no alternative available. Since it has being discovered to contain
three regular expressions vulnerable to catastrophic backtracking. Given a multitude of better options today this package was just updated to wrap [markdown-it][] to avoid breaking existing dependencies, but then again there is no reason to prefer it over other well maintained library.

[markdown-it]: https://www.npmjs.com/package/markdown-it
[marked]: https://www.npmjs.com/package/marked
