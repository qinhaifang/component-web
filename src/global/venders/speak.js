export function speak(textToSpeak) {
  if (navigator.platform == "Win32" || navigator.platform == "Windows") {
    //创建一个 SpeechSynthesisUtterance的实例
    var newUtterance = new SpeechSynthesisUtterance();
    // 设置文本
    newUtterance.text = textToSpeak;
    //汉语
    newUtterance.lang = "zh-CN";
    newUtterance.rate = 0.75;
    speechSynthesis.speak(newUtterance);
    // 添加到队列
    //window.speechSynthesis.speak(newUtterance);
  }
}
