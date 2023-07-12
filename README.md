# teyfik-i18n-next

Seamless i18n integration for Next.js. Manage locales, route localization,
dynamic content translation, and more. Reach a global audience effortlessly.
#Nextjs #i18n

## Usage

### Installation

Install `teyfik-i18n-next`

```sh
npm i teyfik-i18n-next
```

Install `teyfik-directory-loader` if you don't have a custom loader

```sh
npm i teyfik-directory-loader
```

### Next.js configuration

Configure your i18n settings in next.config.js:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
};

module.exports = nextConfig;
```

### Initializing `pageWithTranslations` helper

`teyfik-i18n-next` uses a function called `pageWithTranslationsFactory` to
create a helper function to use in every page of the app. The factory function
takes a single argument called loader, and the loader function takes a single
argument called locale then returns all the translations for given locale.

1. Using `teyfik-directory-loader`

With the help of `teyfik-directory-loader`, you can load every JSON and YAML
files in a specific directory keeping folder structure. Read more about the
package [here](https://github.com/teyfik-on-it/teyfik-directory-loader#readme)

```ts
import directoryLoader from 'teyfik-directory-loader';
import { pageWithTranslations } from 'teyfik-i18n-next';

const pageWithTranslations = pageWithTranslationsFactory((locale) =>
  directoryLoader('public', 'locales', locale),
);

export default pageWithTranslations;
```

2. Using a custom loader

```ts
import { pageWithTranslations } from 'teyfik-i18n-next';

const pageWithTranslations = pageWithTranslationsFactory((locale) =>
  fetch(`https://example.com/locales/${locale}.json`),
);

export default pageWithTranslations;
```

The loader's return value should return all the translations for the given
locale, as shown in the example below:

```json
{
  "common": {
    "title": "Hello world!",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit..."
  },
  "index": {
    "title": "Home"
  },
  "footer": {
    "copyright": "Copyright © 2023"
  }
}
```

If you prefer to use `teyfik-directory-loader`, your directory structure should
be similar to the following:

```
.
└── path
  └── to
    └── locales
      ├── en
      | └── common.json
      └── de
        └── common.json
```

### Using the `pageWithTranslations` helper

After you initialize a loader and defined `pageWithTranslations` helper you
should use it in your pages to load translations:

```tsx
import { useTranslation } from 'teyfik-i18n-next';
import { pageWithTranslations } from '../helpers/pageWithTranslations';

export default function Home() {
  const { t } = useTranslation();

  return (
    <section>
      <header>
        <h1>{t('common.title')}</h1>
      </header>
    </section>
  );
}

export const getStaticProps = pageWithTranslations('common', (context) => {
  // Your custom getStaticProps logic here

  return {
    props: {},
  };
});
```

You can define filtered namespaces on property level such as:

```ts
export const getStaticProps = pageWithTranslations('common.title');
```

Finally, wrap your app with `I18nProvider`. In the example below, `i18n` prop
comes from `pageWithTranslations` helper that we used with `getStaticProps`.

```tsx
import type { AppProps } from 'next/app';
import { I18nProvider } from 'teyfik-i18n-next';

function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider i18n={pageProps.i18n}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default App;
```

That's it!

## Plurals

In the example below, the translation of `profile.viewCount` that is tried to be
accessed will be changed to `profile.viewCount.other`. Other possible values
will be `profile.viewCount.zero` and `profile.viewCount.one`.

```tsx
export default function Page() {
  const { t } = useTranslation();

  return (
    <section>
      <main>
        <p>{t('profile.viewCount', { count: 5 })}</p>
      </main>
    </section>
  );
}
```

## Answers

In the example below, the translation of `profile.public` that is tried to be
accessed will be changed to `profile.public.yes`. Other possible values will be
`profile.public.no`.

```tsx
export default function Page() {
  const { t } = useTranslation();

  return (
    <section>
      <main>
        <p>{t('profile.public', { answer: true })}</p>
      </main>
    </section>
  );
}
```

## Template literals

Templates will be rendered with Mustache. In the example below, `{{ username }}`
template literal will be changed with the username that is provided in the
context.

`public/locales/en/profile.json`

```json
{
  "salute": "Hello, {{ username }}!"
}
```

```tsx
export default function Profile() {
  const { t } = useTranslation();

  return (
    <section>
      <main>
        <p>{t('profile.salute', { username: 'teyfik' })}</p>
      </main>
    </section>
  );
}
```

The result will be `"Hello, teyfik!"`
