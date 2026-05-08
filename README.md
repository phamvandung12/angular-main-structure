# ɵ angular-main-structure

- Current version (master branch): v18 - Standalone
> For Modular version, see Release v16 and previous.

- Node version: 20

- Remember to change index.html title.
- Remember to change sitemap link in robots.txt.
- Remember to change sitemap.xml.
- Remember to change "JIRA-" to new string same as Jira required in .husky/commit-msg
- Read README-DEV.md
- Run `npm outdated` to see outdated dependencies.
- Run `npm install <dependency>@<ver>` to update a dependency.
- Run `npm update --save` to update all dependencies.
- When project done, remove unused dependency.

- Tracking production bugs: https://sentry.io/organizations/hcm-ute/projects/def-fe-catcher (stc@hcmute.edu.vn)

- Flush SW cache (re-generate hash): `node_modules/.bin/ngsw-config ./dist/browser ./ngsw-config.json <base href>`
