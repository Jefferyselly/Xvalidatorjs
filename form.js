class Form{

	constructor(form_id,options = {}){
		//form_id -> value of the form to be validated.
		//options -> user defined options to work with the form (object)

		this.id = form_id;
		this.options = options;
		this.type = options.type
		this.guardSet = new Set();

	}

	extractInputs(){
	let InObj = new Object()
		//Extract all input elements within the form, check if guard mode is enabled and store the submit button if it is.
	if(this.options.guard_mode){
		InObj.submitBtn = document.getElementById(this.options.guard_mode[1]);
	}
	

	const inputs = document.forms[this.id].getElementsByTagName('input');



	const n_inputs = inputs.length // Count of input elements within the form.
	InObj.inputs = inputs;
	InObj.n_inputs = n_inputs
	 
	
		return InObj
	
}

	is_guard_mode_enabled(field_id,guard_mode_value){
		//Check to see if the guard mode is enabled.
		const id_of_submit = guard_mode_value;

		

		if(guard_mode_value != false){

			this.guardSet.add(field_id);

			document.getElementById(field_id).setAttribute('data-test', false + ','+ id_of_submit.id +'');

			document.getElementById(id_of_submit.id).setAttribute('data-guardmode', this.guardSet)
		}

		

	}

	

	setAtrributes(arry,guard_mode = false){

		let guard_data  = false //  Hold the boolean value for individual fields as false , until they are verified.

		//if guard mode is enabled, turn the submit button to not-allowed
		if(guard_mode != false) {
			guard_mode.disabled = true
			guard_mode.style.cursor = 'not-allowed'
		}


		
		let validate = new String();
		
		const definedOptions = this.options;

		 for(let i = 0; i < arry.length; i++){

		 	if(definedOptions.hasOwnProperty('text_field_validation') && arry[i].type == "text"){ 
		 		validate = 'text'

		 		document.getElementById(arry[i].id).setAttribute('onkeyup', this.type + '(this,"'+ String(validate) + '")')
		 		this.is_guard_mode_enabled(arry[i].id, guard_mode);

		 	}
		 	else if(definedOptions.hasOwnProperty('password_validation') && arry[i].type == "password"){
		 		//Obtain the id of the pass and conf pass field.
		 		const id_of_password = definedOptions.password_validation[0];
		 		const id_of_conf_pass = definedOptions.password_validation[1];

		 		// validate = 'password[]'
		 		if(arry[i].id == id_of_password) {validate = '[password,_1,'+ definedOptions.password_id + ']'}
		 			else{
		 				validate = '[password,_2,'+ definedOptions.password_id + ']'
		 			}
		 		document.getElementById(arry[i].id).setAttribute('onkeyup', this.type + '(this,"'+ String(validate) + '")')
		 		this.is_guard_mode_enabled(arry[i].id, guard_mode);
		 	}
		 	else if(definedOptions.hasOwnProperty('email_validation') && arry[i].type == "email"){
		 		validate = "email"
		 		document.getElementById(arry[i].id).setAttribute('onkeyup', this.type + '(this,"'+ String(validate) + '")')
		 		this.is_guard_mode_enabled(arry[i].id, guard_mode);
		 	}

		 	//After assigning plugin defined attributes, store them individually inside the submit button
		 	

		 	// else if(definedOptions.hasOwnProperty('checkbox_validation') && arry[i].type == "checkbox"){

		 	// 	const number_of_checkbox = definedOptions.checkbox_validation.length;
		 	// 	if(number_of_checkbox != 1){
		 	// 		//Loop through array, since its more than one.
		 	// 	}else{
		 	// 		//Just get the index[0] from the array.
		 	// 		const checkbox_id = definedOptions.checkbox_validation[0];

		 	// 		validate = "[checkbox,"+checkbox_id + "]";

		 	// 		document.getElementById(checkbox_id).setAttribute('onkeyup', this.type + '(this,"' + String(validate) + '")')
		 	// 	}
		 	// }





		}
		
	

	}

	init(){
		
			console.log('Form validation running ...')

			let inputData = this.extractInputs();


			let m = this.setAtrributes(inputData.inputs,inputData.submitBtn)
	}
}


/******* DEFAULT: REALTIME VALIDATION ****************/
function realtime(_id, m){

	const field = new formField(_id,m)	;

	field.validate()

}


class formField{
	constructor(field_id,options){
		
		this.field_id = field_id;
		this.options = options	
		this.guardSet = new Set();	
	}

	 create_response_area(response){
		const parentNode = this.field_id.parentNode;
		const div = document.createElement('div');
		let text = document.createTextNode(response);
		div.style.clear = 'both';
		div.style.color = 'red';

		div.appendChild(text)
		
		parentNode.appendChild(div);
		div.setAttribute('id','field-'+this.field_id.id)

	}

	remove_response_area(){
		const parentNode = this.field_id.parentNode;
		const childNode = document.getElementById('field-'+this.field_id.id)
		parentNode.removeChild(childNode)
	}

	guard_mode_enabled(field_id){

			//Check if guard mode is enabled by checking the data-test attribute.

			if(document.getElementById(field_id).hasAttribute('data-test') == true){

				//Insert the guardSet into new data attribute in the submit button.
				const the_attribute = document.getElementById(field_id).getAttribute('data-test');
				const _id = the_attribute.indexOf(",");

				const submit_btn_id = the_attribute.slice(_id + 1, the_attribute.length);

				//add the guardSet to submit button.
				document.getElementById(submit_btn_id).setAttribute('data-confirm', this.guardSet);

				//get the data attributes @ submit button and compare them to see if all have been fixed.

					// console.log(document.getElementById(submit_btn_id).getAttribute('data-confirm');

			}

	}



	validate(){
		const field_id = this.field_id



		//TEXT VALIDATION

		if(this.options == 'text'){

			//Validate for Length

			if(field_id.value.length <= 4 || field_id.value.length == "" || field_id.value.length == null || field_id.value.length == undefined){
					if(document.getElementById('field-'+ this.field_id.id)){
				this.remove_response_area()
			}				
				this.create_response_area('Input field should be greater than 4')

			}else{
				if(document.getElementById('field-'+ this.field_id.id)){

				this.remove_response_area()
			}

				//Run the guard_mode_enabled method to see if it was enabled.
				this.guard_mode_enabled(field_id.id);


			}
			//Validate for Special symbols.
			if(field_id.value.search(/[`¬!"£$%^&*()_=+;'"/?.><,]/g) >= 0){
				if(document.getElementById('field-'+ this.field_id.id)){
					this.remove_response_area();
				}
				this.create_response_area('Special characters are not allowed')

			}





		}

		//PASSWORDS VALIDATION

		else if(this.options.indexOf('[password,_1,') >= 0){

			

				//Password must be more than 5 characters
				if(field_id.value.length <= 5 || field_id.value == "" || field_id.value == null || field_id.value == undefined){
					if(document.getElementById('field-'+this.field_id.id)){
						this.remove_response_area()
					}  
					this.create_response_area('Password cannot be less than 5 characters')
				}else{
				if(document.getElementById('field-'+ this.field_id.id)){

				this.remove_response_area()
			}

	}

			//Password must contain special characters for strength
			if(field_id.value.search(/[`¬!"£$%^&*()_=+;'"/?.><,]/g) < 0 ){
				if(document.getElementById('field-'+ this.field_id.id)){
					this.remove_response_area();
				}
				this.create_response_area(' Must contain atleast one special symbol')
			}

}


	else if(this.options.indexOf('[password,_2,') >= 0){

		//The confirmation password must match the initial

		const ref = this.options // holds the overall data in the onKeyUp# event for password 2
		const ref_id = ref.lastIndexOf(",");

		const prev_pass_id = document.getElementById(ref.slice(ref_id + 1, ref.length - 1));

		if(field_id.value != prev_pass_id.value){
			//Check if they correspond
			if(document.getElementById('field-'+this.field_id.id)){
				this.remove_response_area()
			}
			this.create_response_area('Passwords do not match')
		}
		else{
				if(document.getElementById('field-'+ this.field_id.id)){

				this.remove_response_area()
			}}


	}

	//EMAIL VALIDATION
	else if(this.options == 'email'){

		//Email must not contain special characters except from  @ and . 

		const email = field_id.value;
		const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		const is_email = re.test(email);
		
		if(!is_email){
				if(document.getElementById('field-'+this.field_id.id)){
				this.remove_response_area()
			}
			this.create_response_area('Invalid Email address')
		}else{
			if(document.getElementById('field-'+this.field_id.id)){
				this.remove_response_area()
			}
		}

	}

	//CHECKBOX VALIDATION
	// else if(this.options.indexOf('[checkbox,') >= 0){

	// 	//Get the id of the current checkbox area
	// 	//
	// }
}
}
