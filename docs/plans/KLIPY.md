# Migration Plan: Giphy to Klipy

## Overview
Switch from Giphy API to Klipy API for GIF functionality in the flashpage.io application.

## Files to Modify

### 1. Environment Configuration
- `.env.example`: Replace GIPHY_API_KEY with KLIPY_API_KEY
- `nuxt.config.ts`: Update runtimeConfig to use klipyApiKey instead of giphyApiKey
- `.github/workflows/deploy.yml`: Replace GIPHY_API_KEY secret with KLIPY_API_KEY
- `docker-compose.yml`: Update environment variable from GIPHY_API_KEY to KLIPY_API_KEY
- `infra/production/docker-compose.yml`: Update environment variable

### 2. Backend API
- Rename `/server/api/giphy/search.get.ts` to `/server/api/klipy/search.get.ts`
- Update API endpoint to use Klipy's API (https://api.klipy.co)
- Modify response parsing to match Klipy's format:
  - Klipy returns `data.data` array instead of direct `data`
  - GIF URLs are in `files.gif` instead of `images.original.url`
  - Thumbnails are in `files.gif` or `files.webp` instead of `images.fixed_height.url`

### 3. Frontend Component
- `app/components/form/GifSearcher.vue`:
  - Update API call from `/api/giphy/search` to `/api/klipy/search`
  - Update placeholder text to "Search KLIPY..." (per API requirements)
  - Modify GIF object access:
    - Change `gif.images.original.url` to `gif.files.gif`
    - Change `gif.images.fixed_height.url` to `gif.files.webp || gif.files.gif`
  - Add "Powered by KLIPY" attribution (required by API terms)

### 4. Documentation
- Update README.md to reflect Klipy instead of Giphy

## Implementation Steps

1. **Get Klipy API Key**
   - Sign up at https://partner.klipy.com/api-keys
   - Store in GitHub secrets as KLIPY_API_KEY

2. **Update Backend**
   - Rename and modify the search API endpoint
   - Update response transformation logic

3. **Update Frontend**
   - Modify GifSearcher component
   - Add required attribution

4. **Update Configuration**
   - Replace all environment variable references
   - Update runtime config

5. **Test**
   - Verify GIF search functionality
   - Ensure proper display of results
   - Check that selected GIFs save correctly

## Key API Differences

| Feature | Giphy | Klipy |
|---------|-------|-------|
| Base URL | api.giphy.com | api.klipy.co |
| Auth | api_key param | app_key in URL path |
| Response | `{ data: [...] }` | `{ result: true, data: { data: [...] } }` |
| GIF URL | `images.original.url` | `files.gif` |
| Thumbnail | `images.fixed_height.url` | `files.webp` or `files.gif` |
| Attribution | Optional | Required "Powered by KLIPY" |
| Placeholder | Any | Must be "Search KLIPY" |

## Example API Calls

### Giphy (Current)
```javascript
await $fetch('https://api.giphy.com/v1/gifs/search', {
  params: {
    api_key: config.giphyApiKey,
    q: query.q,
    limit: 12,
    rating: 'pg'
  }
})
```

### Klipy (New)
```javascript
await $fetch(`https://api.klipy.co/api/v1/${config.klipyApiKey}/gifs/search`, {
  params: {
    q: query.q,
    per_page: 12,
    content_filter: 'safe'  // equivalent to 'pg' rating
  }
})
```

## Response Structure Changes

### Giphy Response
```json
{
  "data": [
    {
      "id": "gif-id",
      "title": "GIF Title",
      "images": {
        "original": {
          "url": "https://media.giphy.com/..."
        },
        "fixed_height": {
          "url": "https://media.giphy.com/..."
        }
      }
    }
  ]
}
```

### Klipy Response
```json
{
  "result": true,
  "data": {
    "data": [
      {
        "url": "canonical-url",
        "title": "GIF Title",
        "slug": "gif-slug",
        "files": {
          "gif": "https://cdn.klipy.co/...",
          "webp": "https://cdn.klipy.co/...",
          "mp4": "https://cdn.klipy.co/..."
        }
      }
    ],
    "current_page": 1,
    "per_page": 12,
    "has_next": true
  }
}
```

## Required UI Changes

1. **Search Placeholder**: Must be "Search KLIPY"
2. **Attribution**: Add "Powered by KLIPY" mark (visible near GIF selector)
3. **Default State**: Consider showing trending GIFs from Klipy when search is empty

## Testing Checklist

- [ ] API key properly configured in environment
- [ ] Search functionality returns results
- [ ] GIFs display correctly in grid
- [ ] GIF selection works
- [ ] Selected GIF displays in preview
- [ ] Selected GIF URL saves to database
- [ ] Subdomain pages display saved GIFs
- [ ] "Powered by KLIPY" attribution visible
- [ ] "Search KLIPY" placeholder text present
- [ ] Error handling for API failures
- [ ] Production deployment variables updated