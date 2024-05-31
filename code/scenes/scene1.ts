scene('init', async () => {
  let c = add([
    sprite("bean"),
    pos(80, 40),
    area(),
  ])

  console.log(c)

  onClick(() => {
    addKaboom(mousePos())
  })

  // burp on "b"
  onKeyPress("b", () => burp())
})