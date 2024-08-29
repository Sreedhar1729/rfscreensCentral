sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.app.odata.controller.Home", {
        onInit: function () {

        },
        onAdd: async function () {
            this.oDialog ??= await this.loadFragment({
                name: "com.app.odata.fragments.create"
            })
            this.oDialog.open();

        },
        onCancel: function () {
            // this.oDialog.close();
            this.byId("idInput").setValue(""),
                this.byId("idInput1").setValue(""),
                this.byId("idInput2").setValue(""),
                this.byId("idInput3").setValue(""),
                this.byId("idInput4").setValue(""),
                this.byId("idInput5").setValue(""),
                this.byId("idInput6").setValue("")
            this.byId("idDialog").close();
        },
        onDelete: function () {
            var oView = this.getView();
            var osel = oView.byId("idTable").getSelectedItem().getBindingContext().getPath();
            // /Products(0)
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            oModel.remove(osel, {
                success: function () {
                    sap.m.MessageBox.success("Successfully Deleted!!");
                    oModel.refresh(true);
                },
                error: function () {
                    sap.m.MessageBox.error("Error Exist")
                }

            })
            this.onAfterRendering();
        },
        onCreate: async function () {
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            var temp = this.byId("idInput").getValue();
            var idEsixts = await this.onRead(temp);
            if (idEsixts) {
                sap.m.MessageBox.error("ID already exsists");
                return
            }
            var that = this;
            oModel.create("/Products", {
                ID: this.byId("idInput").getValue(),
                Name: this.byId("idInput1").getValue(),
                Description: this.byId("idInput2").getValue(),
                ReleaseDate: this.byId("idInput3").getValue(),
                Rating: this.byId("idInput4").getValue(),
                DiscontinuedDate: this.byId("idInput5").getValue(),
                Price: this.byId("idInput6").getValue()
            }, {
                success: function () {
                    sap.m.MessageBox.success("Successfully Created!!!");
                    // this.onRun();

                    oModel.refresh();
                    that.onAfterRendering();

                },
                error: function () {
                    sap.m.MessageBox.error("Error Exist")
                }

            })
            this.onCancel();
        },
        onEdit1: function (oEvent) {
            var oButton = oEvent.getSource();
            var oText = oButton.getText();
            var Table = oButton.getParent();
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            if (oText === 'Edit') {
                oButton.setText("Submit");
                var ocell1 = oButton.getParent().getCells()[4].setEditable(true);
                var ocell2 = oButton.getParent().getCells()[6].setEditable(true);
            } else {
                oButton.setText("Edit");
                var ocell1 = oButton.getParent().getCells()[4].setEditable(false);
                var ocell2 = oButton.getParent().getCells()[6].setEditable(false);
                var value = oButton.getParent().getCells()[4].getValue();
                var value1 = oButton.getParent().getCells()[6].getValue();
                var id = oButton.getParent().getCells()[0].getText();
                // updating
                oModel.update("/Products(" + id + ")", { Rating: value, Price: value1 }, {
                    success: function () {
                        sap.m.MessageBox.success("Successfully Update!!");
                    },
                    error: function () {
                        sap.m.MessageBox.error("Error Exist")
                    }
                }
                )
            }
        },
        onRead: function (temp) {
            var oModel = this.getView().getModel();
            return new
                Promise
                ((resolve, reject) => {
                    oModel.read("/Products", {
                        filters: [new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, temp)],
                        success: function (oData) {
                            // sap.m.MessageBox.error("Value Exists");
                            resolve(oData.results.length >0);
                        },
                        error: function (oError) {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                });
        },
        onSorter: function () {
            var oTable = this.byId("idTable");
var oBinding = oTable.getBinding("items");

if (oBinding) {
    var oSorter = new sap.ui.model.Sorter('Price', true); // Replace 'Price' with your sorting property
    oBinding.sort(oSorter);
} else {
    sap.m.MessageToast.show("Table binding not found. Cannot apply sorting.");
}

        },
        onAfterRendering: function () {
            var oTable = this.byId("idTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.attachEventOnce("dataReceived", function () {
                    var iRowCount = oBinding.getLength();
                    var oText = this.byId("rowCount");
                    oText.setText("Total Rows: " + iRowCount);
                }, this);
            }
        }
    });
});
