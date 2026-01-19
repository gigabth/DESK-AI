# N8N Workflow Design for DeskSpace AI

This document outlines the logical flow for the N8N backend to support the DeskSpace React Frontend.

## Overview
The workflow uses a single Webhook trigger that acts as a router based on an `action` parameter sent from the frontend.

### Webhook Node
*   **Method:** POST
*   **Path:** `deskspace-gen`
*   **Input Data:** `action`, `payload` (JSON)

### Switch Node (Router)
Routes the execution based on `json.body.action`.

---

## Route 1: `generate_draft_plan`
**Goal:** Generate a Thai step-by-step plan based on user concept and available product assets.

1.  **Input:** `{ products: [], count: 5, concept: "..." }`
2.  **Google Sheets (Get Info):**
    *   Lookup `driveFolderId` for the selected SKUs.
3.  **Google Drive (List Files):**
    *   List files in the specific SKU folders to know what angles are available (e.g., `ISO_Right.png`, `Front.png`).
    *   *Output:* Array of filenames.
4.  **Gemini (Thinking/Planning):**
    *   *System Prompt:* "You are a Creative Director. Plan {count} images for product {productName}. Available angles: {fileList}. Concept: {concept}. Output a JSON array of strings in Thai describing each image."
5.  **Respond to Webhook:** Return the JSON array.

---

## Route 2: `generate_final_prompt`
**Goal:** Convert Thai description to Technical English Prompt (Nano Banana Pro format).

1.  **Input:** `{ stepIndex: 1, description: "...", products: [], backgroundRef: "url..." }`
2.  **Gemini (Technical Writer):**
    *   *System Prompt:* "You are a Technical AI Prompt Engineer. Convert this description to the specific text format for Nano Banana Pro. Rules: 1. Start with Subject. 2. Define Action. 3. Add 'CRITICAL PRODUCT & BACKGROUND CONSTRAINTS'. 4. If `backgroundRef` is present, strictly enforce consistency with it."
    *   *Input Text:* The Thai description + technical template provided in `text/plain` file.
3.  **Respond to Webhook:** Return `{ finalPrompt: "..." }`.

---

## Route 3: `generate_image`
**Goal:** Call Kie.ai (Nano Banana Pro) to generate the actual image.

1.  **Input:** `{ prompt: "...", products: [], backgroundRef: "..." }`
2.  **Download References (HTTP Request/Drive):**
    *   The prompt implies using Drive images. N8N needs to get the public/downloadable links for the specific product angle images mentioned in the prompt (or send all valid ones).
3.  **HTTP Request (Kie.ai):**
    *   *URL:* `https://api.kie.ai/api/v1/jobs/createTask`
    *   *Model:* `google/nano-banana-pro`
    *   *Body:*
        ```json
        {
          "input": {
             "prompt": $json.prompt,
             "image_urls": [$json.productImages, $json.backgroundRef], // Product reference + Background ref (if exists)
             "aspect_ratio": "16:9" // or from input
          }
        }
        ```
4.  **Wait:** Loop/Wait for task completion (webhook callback or polling).
5.  **Respond to Webhook:** Return `{ imageUrl: "..." }`.

---

## Error Handling
*   Add **Error Trigger** node in N8N to catch failures and return a standardized JSON `{ error: "message" }` to the React frontend so it can update the step status to `failed`.
