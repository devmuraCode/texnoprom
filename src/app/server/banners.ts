export const getBanners = async () => {
    const res = await fetch("https://back-texnoprom.uz/banners");
    const data = await res.json();
    return data;
};