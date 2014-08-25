	var OperationRegisterModel = Backbone.Model.extend({
		defaults: function(){
			return{
				value1: 0,
				operation: null,
				value2: 0,
				monitorValue: 0
				//containOperation: false
			}
		},
		check: {
			value1: 'num length:1, 100',
			operation: 'str',
			value2: 'num length:1, 100',
			monitorValue: 'str'
		},

		clearAll: function(){
			this.set({value1:0,operation:null,value2: 0, value1: 0});
		},
		MakeOperation: function(){
			if((this.get('operation'))&&(this.get("value2"))){
				switch(this.get('operation')){
					case '+':this.set('value1', Number(this.get('value1')) + Number(this.get('value2')));break;
					case '-':this.set('value1', Number(this.get('value1')) - Number(this.get('value2')));break;
					case '*':this.set('value1', Number(this.get('value1')) * Number(this.get('value2')));break;
					case '/':this.set('value1', Number(this.get('value1')) / Number(this.get('value2')));break;
				}
				this.set('value2', 0);
				this.set('operation', null);
				this.monitorValue = this.value1;
			}
		},
		validate: Backbone.check
	});

	var CalculatorMonitorView = Backbone.View.extend({
		el: 'form',
		template: _.template($('#calculatorMonitorTemplate').html()),

		initialize: function(){	
			$('html').keypress(jQuery.proxy(this.whenKeyPressed, this));	
			this.render();			
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
		whenKeyPressed: function(e){
			//console.log(String.fromCharCode(e.which)+" "+e.which);
				var valueName = "";
				(this.model.get('operation')) ? valueName = "value2" : valueName = "value1";
				if((e.which >= 48)&&(e.which <= 57)){
					this.model.set(valueName, Number(this.model.get(valueName) + String.fromCharCode(e.which)));	
				}
				else{
					switch (e.which){
						case 99: this.model.set(valueName, '0');//c
						case 67: this.model.clearAll();//C
						case 61: this.model.MakeOperation(); valueName = "value1"; break;//=
						case 13: this.model.MakeOperation(); valueName = "value1"; break;//enter
						case 46: this.model.set(valueName, this.model.get(valueName)+".");break;//dot
					}
				}
				switch(e.which){
						case 42: this.model.set('operation', '*');break;//multiply
						case 43: this.model.set('operation', '+');break;//add
						case 45: this.model.set('operation', '-');break;//substract
						case 47: this.model.set('operation', '/');break;//divide
				}
				this.model.set('monitorValue', this.model.get(valueName));
				this.render();
		}
		
	});
	
	var calculatorMonitor = new CalculatorMonitorView({model: new OperationRegisterModel});