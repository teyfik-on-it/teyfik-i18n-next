# teyfik-i18n-next

Seamless i18n integration for Next.js. Manage locales, route localization,
dynamic content translation, and more. Reach a global audience effortlessly.
#Nextjs #i18n

## Usage

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

### Translation loaders

`teyfik-i18n-next` uses the specified loader for loading translations from disk
or from a remote location. You can use the default `JSONLoader` or `YAMLLoader`
if they fit your specific use case. Alternatively, you can create your own
loader by implementing the `TranslationLoader` interface. In any case, your
translation loader should return all the translations for the specified locale.

1. Using `JSONLoader`

```ts
import { JSONLoader } from 'teyfik-i18n-next/dist/loaders/JSONLoader';

const loader = new JSONLoader('path', 'to', 'locales');
```

2. Using `YAMLLoader`

```ts
import { YAMLLoader } from 'teyfik-i18n-next/dist/loaders/YAMLLoader';

const loader = new YAMLLoader('path', 'to', 'locales');
```

3. Creating a custom loader

```ts
import { TranslationLoader } from 'teyfik-i18n-next';

class HttpLoader implements TranslationLoader {
  load(locale: string) {
    return fetch(`https://example.com/locales/${locale}.json`).then((res) =>
      res.json(),
    );
  }
}
```

The loader's return value should return all translations for the specified
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

If you are using JSONLoader or YAMLLoader, your folder structure should be
similar to the following:

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

### Creating the `pageWithTranslations` helper

After you initialize a loader, you should use it with
`pageWithTranslationsFactory`

```ts
import { pageWithTranslationsFactory } from 'teyfik-i18n-next';
import { JSONLoader } from 'teyfik-i18n-next/dist/loaders/JSONLoader';

const loader = new JSONLoader('path', 'to', 'locales');
const pageWithTranslations = pageWithTranslationsFactory(loader);

export default pageWithTranslations;
```

Later on, use the `pageWithTranslations` helper in pages

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
