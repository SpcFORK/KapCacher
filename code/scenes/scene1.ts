scene('init', async () => {
  loadSprite("bean", "sprites/bean.png")

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