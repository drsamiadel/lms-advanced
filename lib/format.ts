export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  const result = `${
    hours ? (hours > 9 ? hours.toFixed() + ":" : "0" + hours.toFixed() + ":") : ""
  }${minutes > 9 ? minutes.toFixed() + ":" : "0" + minutes.toFixed() + ":"}${
    seconds > 9 ? seconds.toFixed() : "0" + seconds.toFixed()
  }`;

  return result;
} 