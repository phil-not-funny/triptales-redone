# Languages

The UI texts live in `frontend/messages/<language>.json` (next-intl). This file tracks what is still missing per language.

| Language   | File      | Status              |
| ---------- | --------- | ------------------- |
| English    | `en.json` | Source, complete    |
| German     | `de.json` | Complete            |
| Dutch      | `nl.json` | Complete            |
| Hungarian  | `hu.json` | 8 keys open, 1 to check |

## Rules

- `en.json` is the source. A key missing in another language file falls back to the English text (`frontend/i18n/request.ts`).
- New keys go into `en.json` and into the languages being actively translated. For every other language, leave the key out of its file (no placeholder) and list it below with its English text.
- After translating a key, add it to the language file and remove it from the list below.

## Open work

### German (`de.json`)

Nothing open.

### Dutch (`nl.json`)

Nothing open.

### Hungarian (`hu.json`)

Missing in `hu.json` (shown in English until translated):

| Key                                   | English                                               |
| ------------------------------------- | ----------------------------------------------------- |
| `Pages.editPost`                      | Edit Post                                             |
| `PostControls.editPost`               | Edit this Post                                        |
| `Sorry.notAllowed`                    | You are not allowed to edit this post.                |
| `Forms.NewPostForm.edit.success`      | Post saved successfully!                              |
| `Forms.NewPostForm.edit.error`        | Failed to save post!                                  |
| `Forms.NewPostForm.edit.pictureError` | Post saved, but some pictures could not be uploaded.  |
| `Forms.NewPostForm.upload.saving`     | Saving your post …                                    |
| `Sidebar.languageUnavailable`         | Language not available yet                            |

To check:

- `Footer.on` is still the English `"on"` (in "Homepage Picture by NEOM **on** Unsplash"). Check whether the Hungarian sentence needs a different word or word order.
