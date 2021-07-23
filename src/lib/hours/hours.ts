export const convertToHours = (duration: number) =>{
return  Number((duration / (1000 * 60 * 60)).toFixed(1));
}

export const getParsedDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  return `${day}/${month + 1}/${year}`;
};
