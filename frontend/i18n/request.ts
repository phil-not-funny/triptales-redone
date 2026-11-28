import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import en from '../messages/en.json';

type Messages = { [key: string]: string | Messages };

export function withFallback(fallback: Messages, messages: Messages): Messages {
  const result: Messages = { ...fallback };
  for (const [key, value] of Object.entries(messages)) {
    const base = fallback[key];
    result[key] =
      typeof value === 'object' && typeof base === 'object' ? withFallback(base, value) : value;
  }
  return result;
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'en';

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return { locale, messages: withFallback(en, messages) };
  } catch {
    return { locale: 'en', messages: en };
  }
});
