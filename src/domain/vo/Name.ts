export default class Name {
    private value: string
    constructor(name: string) {
        const isNameValid = !!name.match(
            /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
          );

          if (!isNameValid) {
            throw new Error("Invalid Name");
          }
        this.value = name
    }
    getValue() {
        return this.value
    }
}