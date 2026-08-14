// Ye sample "knowledge base" hai - tumhare e-commerce store ka data
// Real project me ye MongoDB ke Orders/Products collection se aayega,
// ya FAQ/policy documents se aayega.

export const documents = [
  {
    id: "order-1234",
    text: "Order #1234 ka status 'Shipped' hai. Ye order Mumbai warehouse se dispatch hua hai aur estimated delivery date 2 din baad hai. Courier partner Delhivery hai.",
  },
  {
    id: "order-5678",
    text: "Order #5678 abhi 'Processing' state me hai. Payment confirm ho chuka hai, seller order pack kar raha hai. Dispatch hone me 1 din lagega.",
  },
  {
    id: "policy-return",
    text: "Return policy: Kisi bhi product ko delivery ke 7 din ke andar return kiya ja sakta hai, bashart product unused ho aur original packaging me ho. Refund 5-7 business days me process hota hai.",
  },
  {
    id: "policy-shipping",
    text: "Shipping policy: Free shipping tab milti hai jab order value 499 rupee se zyada ho. Standard delivery 3-5 din leti hai, express delivery 1-2 din me hoti hai extra charge ke sath.",
  },
  {
    id: "product-shoes",
    text: "Running Shoes Pro Max product ki price 2499 rupee hai. Ye shoes size 6 se 11 tak available hain. Material: mesh upper, rubber sole. Stock me available hai.",
  },
  {
    id: "policy-payment",
    text: "Payment options: Credit card, debit card, UPI, aur Cash on Delivery (COD) available hai. COD orders par 20 rupee extra convenience fee lagta hai.",
  },
];
