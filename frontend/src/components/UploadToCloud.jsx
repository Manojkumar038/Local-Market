
export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};


export const deleteFromCloudinary = async (publicId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/delete-cloudinary-image`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    }
  );

  const json = await res.json();
  return json;
};
