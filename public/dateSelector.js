$.dateSelector = {
    datePickerId: "#datepicker",

    create: function(){
        $(this.datePickerId).datetimepicker({
            showButtonPanel: true,
            stepMinute:10,
            onClose: function(dateText, inst){
                $.settings.date = $($.dateSelector.datePickerId).datetimepicker( "getDate" );
                $.dateSelector.resetFreeParkings();
            },
        });
    },

    dateActivated: function(){
        $("#datepicker").show();
        $.settings.date=$(this.datePickerId).datetimepicker( "getDate" );
        if ($.settings.date!=null)
            {
                this.resetFreeParkings();
            }
    },

    dateDeactivated: function(){
        $(this.datePickerId).hide();
        if ($.settings.date!=null){
            $.settings.date=null;
            $(this.datePickerId).val('');
            this.resetFreeParkings();
        }
    },

    resetFreeParkings: function(){
        var visibility=$.parkingMap.getFreeVisibility();
        $.parkingMap.deleteFreeParkings();
        $.requestHandler.request({id: "free", source: $.freeParkingAPI}, $.main.addMapElement);
        $.parkingMap.toggleFreeParkings(visibility);
    }
}