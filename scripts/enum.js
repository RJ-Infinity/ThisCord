class Enum{
	static #alowedConstructor = false;
	static initEnum(EnumClass){
		if (!(EnumClass.prototype instanceof Enum)){
			throw "Error: Custom enum must extend the `Enum` class";
		}
		Enum.#alowedConstructor = true;
		Object
		.keys(EnumClass)
		.forEach(
			key => EnumClass[key] = new Enum(EnumClass, key)
		);
		Enum.#alowedConstructor = false;
		return EnumClass
	}

	#ID;
	#EnumClass;
	get name(){return this.#ID;}
	constructor(enumClass,id){
		if (!Enum.#alowedConstructor){
			throw "Error: Private Constructor";
		}
		this.#EnumClass = enumClass;
		this.#ID = id;
	}
}

class TestEnum extends Enum{
	static EnumValue1;
	static EnumValue2;
	static EThis;
}
Enum.initEnum(TestEnum)
exports({Enum})