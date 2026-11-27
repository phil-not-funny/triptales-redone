# Languages

The UI texts live in `frontend/messages/<language>.json` (next-intl). This file tracks what is still missing per language.

| Language   | File      | Status              |
| ---------- | --------- | ------------------- |
| English    | `en.json` | Source, complete    |
| German     | `de.json` | Complete            |
| Dutch      | `nl.json` | Complete            |
| Hungarian  | `hu.json` | 8 keys open, 1 to check |

## Rules

- `en.json` is the source. Every key must exist in every language file, otherwise next-intl shows an error instead of the text.
- A key that is not translated yet gets the value `"<key path> not translated"`, e.g. `"Sorry.notAllowed not translated"`. It stands out in the UI and can be found with:
  ```
  grep -rn "not translated" frontend/messages
  ```
- After translating a key, replace the placeholder and remove the key from the list below.

## Open work

### German (`de.json`)

Nothing open.

### Dutch (`nl.json`)

Nothing open.

### Hungarian (`hu.json`)

Not translated yet (English text in `en.json`):

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

- `Footer.on` is still the English `"on"` (in "Homepage Picture by NEOM **on** Unsplash"). It has no placeholder because it sits in the middle of the footer sentence. Check whether the Hungarian sentence needs a different word or word order.
