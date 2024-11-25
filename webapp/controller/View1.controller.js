sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageStrip"
], function(Controller, JSONModel, MessageToast, MessageStrip) {
	"use strict";

	return Controller.extend("zjblessonsForm.controller.View1", {
			
			checkChangeBoxSelectedProperty: function(){
				var bStatus = this.getView().byId('checkbox').getProperty('selected')
				oSelectedModel.setProperty('selected',bStatus)
				console.log(bStatus)
			
			},
			
			onInit : function () {
				//Модель с названиями городов
				var oCityModel,
				oCityModel = new JSONModel({
					cities:[
						"Брест",
						"Витебск",
						"Гомель",
						"Гродно",
						"Минск",
						"Могилев"
						]
				});
					//Модель для отслеживания состояния чекбокса
				var oFormModel,
				oFormModel = new JSONModel({
					selected:this.getView().byId('checkbox').getProperty('selected')
				});
				
					//Передача моделей представлению
				
				this.getView().setModel(oCityModel, "citiesModel");
				this.getView().setModel(oFormModel, "formModel");
				
				var cities = this.getView().getModel("citiesModel").getProperty("/cities");
				var oSelect = this.getView().byId("cities")
				
				for (let i = 0; i<cities.length;i++){
						var oCityItem = new sap.ui.core.ListItem({
							key:i,
							text:cities[i]
						})
						oSelect.addItem(oCityItem)
						console.log(oCityItem.mProperties.text)
					}
					this.getView().byId('conditions').addStyleClass("rules")
					this.getView().byId('checkbox').addStyleClass("rules")
			},
			
			checkChangeBoxSelectedProperty: function(){
				var bStatus = this.getView().byId('checkbox').getProperty('selected')
				this.getView().getModel("formModel").setProperty("/selected",bStatus)
				console.log(this.getView().getModel("formModel").oData.selected,bStatus)
			},
			
			//Отправка формы
			onSubmit: function(oEvent){
		    	var requiredInputs = this.returnIdListOfRequiredFields();
		        var passedValidation = this.validateEventFeedbackForm(requiredInputs);
		        if(passedValidation === false){
		        	return false;
		        }
		        	MessageToast.show("Регистрация прошла успешно.\n" + this.verifyPromocode())
		            this.onResetForm()//Maybe show a success message, rest of function will execute.
		    },
		    
		    //Список обязательных для заполнения инпутов
			returnIdListOfRequiredFields: function() {
		        let requiredInputs;
		        return requiredInputs = [
		        	'firstName',
		        	'secondName',
		        	'tel',
		        	'emailAddress',
		        	'password'
		        ];
		    },
		
		    //Проверка инпутов на заполнение
		    validateEventFeedbackForm: function(requiredInputs) {
		    	var _self = this;
		        var valid = true;
		        requiredInputs.forEach(function (input) {
		        	var sInput = _self.getView().byId(input);
		        	if (sInput.getValue() == "" || sInput.getValue() == undefined) {
		            	valid = false;
		                sInput.setValueState("Error")
		                sInput.setValueStateText("Поле не заполнено")
		            } else {
		                sInput.setValueState("None")
		                sInput.setValueStateText("")
		            }
		        });
		            return valid;
		     },
		     
		     //Проверка паролей
		     onCheckPassword : function (oEvent){
		     	var sInputConfirm = this.getView().byId("confirm");
				var sInputPassword = this.getView().byId("password");
				var sInputConfirmValue = sInputConfirm.getValue();
				var sInputPasswordValue = sInputPassword.getValue()
				console.log(sInputConfirm)
				if(sInputConfirmValue != sInputPasswordValue){
					sInputConfirm.setValueState("Error")
					sInputConfirm.setValueStateText("Пароли не совпадают")
				} else {
					sInputConfirm.setValueState("None")
					sInputConfirm.setValueStateText("")
				}
			},
			
			//Очистка формы
			 onResetForm: function(){
			 	var _self = this;
			 	var requiredInputs = this.returnIdListOfRequiredFields();
			 	console.log("ret", requiredInputs)
			 	requiredInputs.push('getPromocode', 'checkPromocode', 'confirm')
			 	requiredInputs.forEach(function (input) {
		        	var sInput = _self.getView().byId(input);
		        	sInput.setValue("")
		        	console.log("SInput",sInput)
		        })
			 },
			 
			 //Передача промокода из url в input / если в промокоде нет->запрос на стороне
			 _readPromocodefromURLOrFromService : function(){
			 	let url = window.location.search
			 	var params = new URLSearchParams(url)
			 	console.log("Params", params)
			 	var promo;
			 	var that = this
			 	if(params.get('promocode')){
			 		promo = params.get('promocode')
			 		that.getView().byId('promocode').setValue(promo)
			 		that.getView().byId('promocode').setProperty('enabled', false)
			 	} else {
			 		оQuery.ajax({
					method:"GET",
					url:"https://random-word-api.vercel.app/api?words=1",
					success : function (data){
						console.log(data)
						var toast_msg = "Word of the day " + data[0];
						MessageToast.show(toast_msg);
						promo = data[0]
						that.getView().byId("getPromocode").setValue(promo)
						that.getView().byId('promocode').setProperty('enabled', false)
						console.log(promo)
			 		}, 
					error : function (error) {
						console.log(error)
					}
			 	})
			 }
			 	console.log("PRomo",promo)
			 },
			 
			 //Формирование текста заключителного сообщения с условием наличия (совпадения) / 
			 // отсутствия (несовпадения) промокода
			  verifyPromocode: function () {
				  	var that = this;
						if((that.getView().byId("getPromocode").getValue()!=="")
						&&(that.getView().byId("checkPromocode").getValue() === that.getView().byId("getPromocode").getValue())){
						console.log("Good!")
						return "Промокод успешно применен!"
					} else {
						return "Промокод не найден"
					}
			  }
			
	});
});