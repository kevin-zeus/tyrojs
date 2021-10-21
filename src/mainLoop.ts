namespace tyro {
  function clear() {
    if (tyro.$canvas && tyro.$context) {
      tyro.$context.clearRect(0, 0, tyro.$canvas.width, tyro.$canvas.height);
    }
  }
}