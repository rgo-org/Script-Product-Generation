// Cấu hình script
let publisherAPIToken = "-TQvCiC9t_r1qJlmNs9NNQ";
let productListContainer = document.querySelector('script[src*="rgo-org"]');
let category = document.querySelector(".the-article-header .the-article-category a").innerText;

// Hàm xử lý lấy keyword tự động
const keywords = (function () {
  return Array.from(
    document.querySelectorAll('meta[name="keywords"], meta[property="article:tag"]')
  )
    .slice(0, 3)
    .map((i) => i.getAttribute("content").trim());
})();

const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const getProductInfo = async (url, category, keywords) => {
  const myHeaders = new Headers();
  myHeaders.append("Authentication", "waXTDuEAOHIfNTXnNmFXBMweoYM2z4");
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    post_url: url,
    category: `Top 30 sản phẩm ${category}`,
    publisher_key: publisherAPIToken,
    button_background_color: "#A528C8",
    keyword: keywords,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("https://tussle.org/webhook/product-generation", requestOptions)
    .then((response) => response.json())
    .then(({ list_id, publisher_id }) => {
      let container = document.createElement("div");
      container.id = `mo-product-list-${list_id}`;
      productListContainer.insertAdjacentElement("beforebegin", container);
      let script = document.createElement("script");
      script.src = `https://tussle.org/api/generate-component?publiser_id=${publisher_id}&list_id=${list_id}`;
      script.type = "text/javascript";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch((error) => error);
};

if (productListContainer && category) {
  let currentUrl = new URL(window.location.href);
  let url = `${currentUrl.origin}${currentUrl.pathname}`;
  getProductInfo(url, category, keywords).then((r) => r);
}
// Kết thúc cấu hình