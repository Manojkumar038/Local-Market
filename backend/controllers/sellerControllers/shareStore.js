import Seller from '../../models/seller.js';


function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export const shareStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Seller.findById(id);
        const domain = process.env.DOMAIN;

        // Fallback if not found
        if (!store) {
            return res.status(404).send("Store not found");
        }

        const title = `${store.storeName} | Local Market`;
        const description = store.description?.slice(0, 160) || "Discover products from this store on Local Market.";
        const image = store.storeBanner || "https://res.cloudinary.com/daqwncrqe/image/upload/v1765030458/premium_photo-1681488262364-8aeb1b6aac56_imm1y1.jpg";
        const url = `${domain}/store/${store._id}`;

        // Send HTML with OG meta tags + your SPA bundle
        res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>

        <!-- Open Graph meta tags -->
        <meta property="og:title" content="${escapeHtml(title)}" />
        <meta property="og:description" content="${escapeHtml(description)}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:type" content="website" />

        <!-- Optional: Twitter card tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeHtml(title)}" />
        <meta name="twitter:description" content="${escapeHtml(description)}" />
        <meta name="twitter:image" content="${image}" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
      </html>
    `);
    } catch (err) {
        console.error("Error in /store/:id share route", err);
        res.status(500).send("Something went wrong");
    }
}