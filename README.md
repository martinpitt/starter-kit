# Cockpit Starter Kit

Scaffolding for a [Cockpit](http://www.cockpit-project.org) module.

# Getting and building the source

Make sure you have `npm` available (usually from your distribution package).
These commands check out the source and build it into the `dist/` directory:

```
git clone https://github.com/cockpit-project/starter-kit.git
cd starter-kit
make
```

# Installing

`make install` compiles and installs the package in `/usr/share/cockpit/`. The
convenience targets `srpm` and `rpm` build the source and binary rpms,
respectively. Both of these make use of the `dist-gzip` target, which is used
to generate the distribution tarball. In `production` mode, source files are
automatically minified and compressed. Set `NODE_ENV=production` if you want to
duplicate this behavior.

For development, you usually want to run your module straight out of the git
tree. To do that, link that to the location were `cockpit-bridge` looks for packages:

```
mkdir -p ~/.local/share/cockpit
ln -s `pwd`/dist ~/.local/share/cockpit/starter-kit
```

After changing the code and running `make` again, reload the Cockpit page in
your browser.

You can also use
[watch mode](https://webpack.js.org/guides/development/#using-watch-mode) to
automatically update the webpack on every code change with

    $ npm run watch

or

    $ make watch

# Running eslint

Cockpit Starter Kit uses [ESLint](https://eslint.org/) to automatically check
JavaScript code style in `.js` and `.jsx` files.

The linter is executed within every build as a webpack preloader.

For developer convenience, the ESLint can be started explicitly by:

    $ npm run eslint

Violations of some rules can be fixed automatically by:

    $ npm run eslint:fix

Rules configuration can be found in the `.eslintrc.json` file.

# Automated Testing

Run `make check` to build an RPM, install it into a standard Cockpit test VM
(centos-7 by default), and run the test/check-application integration test on
it. This uses Cockpit's Chrome DevTools Protocol based browser tests, through a
Python API abstraction. Note that this API is not guaranteed to be stable, so
if you run into failures and don't want to adjust tests, consider checking out
Cockpit's test/common from a tag instead of master (see the `test/common`
target in `Makefile`).

After the test VM is prepared, you can manually run the test without rebuilding
the VM, possibly with extra options for tracing and halting on test failures
(for interactive debugging):

    TEST_OS=centos-7 test/check-application -tvs

You can also run the test against a different Cockpit image, for example:

    TEST_OS=fedora-32 make check

These tests can be run in [Travis CI](https://travis-ci.com/). The included
[travis.yml](./.travis.yml) runs the integration tests for two operating
systems (Fedora and CentOS 8). Note that if/once your project grows bigger, or
gets frequent changes, you likely need to move to a paid account, or different
infrastructure with more capacity. Talk to the
[Cockpit developers](https://cockpit-project.org/) if you are interested in that.

# Customizing

After cloning the Starter Kit you should rename the files, package names, and
labels to your own project's name. Use these commands to find out what to
change:

    find -iname '*starter*'
    git grep -i starter

# Automated release

Once your cloned project is ready for a release, you should consider automating
that.  [Cockpituous release](https://github.com/cockpit-project/cockpituous/tree/master/release)
aims to fully automate project releases to GitHub, Fedora, Ubuntu, COPR, Docker
Hub, and other places. The intention is that the only manual step for releasing
a project is to create a signed tag for the version number; pushing the tag
then triggers a [GitHub action](https://github.com/features/actions) that calls a set of release scripts.

starter-kit includes an example [cockpitous release script](./cockpituous-release),
with detailed comments how to use it. There is also an
[example GitHub release action](.github/workflows/release.yml.disabled) to set
up secrets and run cockpituous.

# Automated maintenance

It is important to keep your [NPM modules](./package.json) up to date, to keep
up with security updates and bug fixes. This is done with the
[npm-update bot script](https://github.com/cockpit-project/bots/blob/master/npm-update)
which is run weekly or upon [manual request](https://github.com/cockpit-project/starter-kit/actions) through the
[npm-update.yml](.github/workflows/npm-update.yml) [GitHub action](https://github.com/features/actions).

# Further reading

 * The [Starter Kit announcement](http://cockpit-project.org/blog/cockpit-starter-kit.html)
   blog post explains the rationale for this project.
 * [Cockpit Deployment and Developer documentation](http://cockpit-project.org/guide/latest/)
 * [Make your project easily discoverable](http://cockpit-project.org/blog/making-a-cockpit-application.html)
