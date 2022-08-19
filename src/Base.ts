class BaseMask {
  getKeyboardType() {
      return 'numeric'
  }

  mergeSettings(obj1: any, obj2: any) {
      return { ...obj1, ...obj2 }
  }

  removeNotNumbers(text: string) {
      return text.replace(/[^0-9]+/g, '')
  }

  removeWhiteSpaces(text: string) {
      return (text || '').replace(/\s/g, '')
  }
}

export default BaseMask;
