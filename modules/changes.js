const listen = actions =>
  document.addEventListener('mv-change', evt => {
    console.log(evt.action, evt.property, evt.value)

    if (evt.action === 'propertychange') {
      if (['base', 'currency', 'feed'].includes(evt.property)) {
        actions[evt.property](evt.value)
      }
    } else {
      console.log('mavo', evt.action)
    }
  })

export default {listen}
