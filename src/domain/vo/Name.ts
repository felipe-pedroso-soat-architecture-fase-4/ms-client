export default class Name {
    private value: string
    constructor(name: string) {
         const isNameValid = /^[a-zA-Z]+(?:[',. -][a-zA-Z]+)*$/.test(name);

          if (!isNameValid) {
            throw new Error("Invalid Name");
          }
        this.value = name
    }
    getValue() {
        return this.value
    }
}