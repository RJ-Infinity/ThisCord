class Enum{
	// note if two items are defined as the same value then the name property of them will
	// always return the name of the first one defined

	// note a construcor should not be defined for cusotom Enum classes
	static #alowedConstructor = false;
	static #Enums = []
	static initEnum(EnumClass){
		if (!(EnumClass.prototype instanceof Enum)){
			throw "Error: Custom enum must extend the `Enum` class";
		}
		Enum.#Enums.push({
			type:EnumClass,
			types: [],
		});
		Enum.#alowedConstructor = true;
		Object
		.keys(EnumClass)
		.forEach(key =>{
			if (
				EnumClass[key] in Enum
				.#Enums
				.filter(e=>e.type==EnumClass)[0]
				.types
				.map(e=>e.id)
			){
				EnumClass[key] = Enum
				.#Enums
				.filter(e=>e.type==EnumClass)[0]
				.types
				.filter(e=>e.id)[0]
			}
			EnumClass[key] = new EnumClass(EnumClass, key)
		});
		Enum.#alowedConstructor = false;
		return EnumClass
	}
	static GetEnumTypes = (EnumClass)=>Object.keys(EnumClass).map(key => EnumClass[key]);
	static GetEnumNames = (EnumClass)=>Object.keys(EnumClass);
	#ID;
	#Name;
	get id(){return this.#ID;}
	get name(){return this.#Name;}
	constructor(EnumClass, name){
		if (!Enum.#alowedConstructor){
			throw "Error: Private Constructor";
		}
		if (
			name in Enum
			.#Enums
			.filter(e=>e.type==EnumClass)[0]
			.types
			.map(e=>e.name)
		){
			throw "Error an Enum cannot Contain the same property twice";
		}
		
		if (EnumClass[name] === null || EnumClass[name] === undefined){
			this.#ID = name;
		}else{
			this.#ID = EnumClass[name];
		}
		this.#Name = name;
		Enum
		.#Enums
		.filter(e=>e.type==EnumClass)[0]
		.types.push(this);
	}
}

// class TestEnum extends Enum{
// 	static EnumValue1;
// 	static EnumValue2;
// 	static EThis;
// }
// Enum.initEnum(TestEnum)
exports({Enum})