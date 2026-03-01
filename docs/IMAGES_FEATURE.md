# Room & Tent Images – Design and Implementation

## 1. Database design

Images are stored in separate tables linked to rooms and tents. No schema change was required; the following already exists.

### Tables

| Table          | Columns                                                                 | Notes |
|----------------|-------------------------------------------------------------------------|-------|
| `room_images`  | `id`, `room_id` (FK → rooms.id ON DELETE CASCADE), `image_path` (TEXT), `is_primary` (0/1) | Max 4 rows per `room_id` enforced in app |
| `tent_images`  | `id`, `tent_id` (FK → tents.id ON DELETE CASCADE), `image_path` (TEXT), `is_primary` (0/1) | Max 4 rows per `tent_id` enforced in app |

- **Relationships**: One room/tent has many images; each image belongs to one room or one tent.
- **Optional**: Rooms and tents can have zero images; listing and detail APIs handle missing images.
- **Limit**: Application enforces a maximum of 4 images per room and per tent (validation on upload and in admin UI).

---

## 2. Backend implementation (Node.js + SQLite)

### Image upload handling

- **Middleware** (`backend/middleware/upload.middleware.js`):
  - **Types**: JPEG, PNG, WEBP only (rejected otherwise).
  - **Size**: 5MB per file.
  - **Count**: Multer accepts at most 4 files per request (`upload.array('images', 4)`).
- **Controller** (`backend/controllers/admin.controller.js`):
  - Before inserting, counts existing images for the room/tent.
  - Rejects upload if adding the new files would exceed 4 total (400 with a clear message).
  - Inserts only up to `(4 - currentCount)` files from the request.

### Max 4 images rule

- Enforced in:
  1. Multer: `upload.array('images', 4)`.
  2. `uploadRoomImages` / `uploadTentImages`: check current count and only insert until total ≤ 4.

### APIs that return rooms/tents with images

- **Public (no auth)**  
  - `GET /api/rooms` – list rooms with `images[]` (id, isPrimary, url).  
  - `GET /api/rooms/search` – same shape.  
  - `GET /api/rooms/:id` – single room with `images[]`.  
  - `GET /api/tents`, `GET /api/tents/search`, `GET /api/tents/:id` – same for tents.
- **Admin (JWT + admin role)**  
  - `POST /api/admin/rooms/:id/images` – upload (body: multipart, field name `images`).  
  - `DELETE /api/admin/rooms/:id/images/:imageId` – delete image and file.  
  - `PUT /api/admin/rooms/:id/images/:imageId/primary` – set primary.  
  - Same for tents: `POST/DELETE/PUT .../tents/:id/images...`.

### File storage and cleanup

- Files are stored on disk under `UPLOAD_DIR` (default `./uploads`) in `rooms/` or `tents/` with unique filenames.
- On `DELETE` image, the controller removes the row and deletes the file from disk (if it exists).

---

## 3. Admin UI flow (rooms and tents)

- **Where**: Admin **Edit Room** and **Edit Tent** pages only (not on “Add”).
- **Flow**:
  1. Open Edit Room (or Edit Tent); the form loads the property and its images (via public `GET /api/rooms/:id` or `GET /api/tents/:id`).
  2. **Current images**: Shown as thumbnails with overlay actions: “Set primary”, “Remove”.
  3. **Add images**: File input (multiple, accept JPEG/PNG/WEBP); “Upload” sends `FormData` to `POST .../admin/.../images`. UI disables adding when there are already 4 images.
  4. After upload/delete/set-primary, the list is refreshed by re-fetching the room/tent.

---

## 4. Frontend display (website)

- **List/cards** (e.g. home, search): `<app-property-card>` receives `images` and shows the **primary** image (or first if none marked primary).
- **Detail page** (`property/:type/:id`):
  - **Primary** image is shown large at the top.
  - **Other images** are shown in a grid below; clicking one updates the large image (gallery-style).
- **Optional enhancements** (not implemented):
  - **Carousel**: Use a small carousel on cards or detail for multiple images.
  - **Lightbox**: Open full-size image in a modal on click.

---

## 5. File storage and security

### Local vs cloud

- **Current**: Local disk (`./uploads`, or `UPLOAD_DIR`). Suitable for single-server, small scale.
- **For scale / resilience**: Prefer object storage (e.g. S3, GCS, Azure Blob). Store only the object key/URL in `image_path`; serve via CDN or signed URLs. Migration path: keep same DB schema and swap upload/delete logic to use the chosen provider.

### Security considerations

- **Validation**: Only JPEG, PNG, WEBP and 5MB limit (middleware + optional controller checks).
- **Auth**: Admin image endpoints are behind JWT + admin role.
- **Paths**: Stored paths are normalized; delete uses resolved absolute path to avoid path traversal.
- **Serving**: Uploads served as static files; ensure no executable uploads and that `Content-Type` is set from file extension or metadata if needed.
- **Recommendation**: Do not execute or interpret uploaded files; treat as static assets only.

---

## 6. Summary

- **Database**: `room_images` and `tent_images` with FKs and optional `is_primary`; max 4 per property enforced in app.
- **Backend**: Validation (type/size), max 4 enforced on upload, APIs return images with URLs, admin CRUD + file delete.
- **Admin UI**: Edit Room/Tent only; view/add/remove/set-primary with immediate refresh.
- **Frontend**: Cards use primary (or first) image; detail page uses primary + clickable gallery grid.
- **Storage**: Local by default; design allows swapping to cloud storage and keeping the same schema and API contract.
