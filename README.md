# teyfik-i18n-next

Seamless i18n integration for Next.js. Manage locales, route localization,
dynamic content translation, and more. Reach a global audience effortlessly.
#Nextjs #i18n

## Usage

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

Create a function called `loadTranslations` that returns all the translations
for specified locale. `loadTranslations` function must take only one argument
called `locale`.

Example return value can be:

```json
{
  "common": {
    "title": "Hello world!"
  },
  "index": {
    "title": "Home"
  },
  "footer": {
    "copyright": "Copyright © 2023"
  }
}
```

You can use default `createLoadTranslations` helper if you're using local JSON
files for translation.

Translations for `en` locale

`public/locales/en/common.json`

```json
{
  "title": "Hello world!"
}
```

Translations for `de` locale

`public/locales/de/common.json`

```json
{
  "title": "Hallo Welt!"
}
```

`createLoadTranslations` helper usage:

```ts
import { createLoadTranslations } from 'teyfik-i18n-next';

export const loadTranslations = createLoadTranslations('public', 'locales');
```

Example translations that comes from `loadTranslations('en')`

```json
{
  "common": {
    "title": "Hello world!"
  }
}
```

Also you can define your custom `loadTranslations` function such as:

```ts
export const loadTranslations = (locale: string) =>
  fetch(`https://example.com/locales/${locale}.json`);
```

Create another function that will be used in pages to provide translations.

```ts
import { createPageWithTranslations } from 'teyfik-i18n-next';
import { loadTranslations } from './loadTranslations';

export const pageWithTranslations =
  createPageWithTranslations(loadTranslations);
```

Use `pageWithTranslations` helper in pages

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

Wrap your app with `I18nProvider`

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
