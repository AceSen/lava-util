function selectRandomCode(codeList) {
  const randomIndex = Math.floor(Math.random() * codeList.length);
  return codeList[randomIndex];
}

module.exports = { selectRandomCode };
