

$(document).ready(function () {

    function viewModel() {
        let self = this;
        // Data
        self.chosenPage = ko.observable();
        self.weightKG = ko.observable(70);
        self.weightPounds = ko.observable(150);
        self.heightCM = ko.observable(170);
        self.heightFeet = ko.observable(5);
        self.heightInches = ko.observable(7);
        self.MetricModeBMI = ko.observable(false);
        self.ImperialModeBMI = ko.observable(false);

        // Behaviour
        self.BMIResult = ko.computed(function () {
            // initializing
            let weight = 0;
            let height = 0;
            // Convert weight and height to kg and m
            if (self.MetricModeBMI() === true) {
                weight = Number(self.weightKG());
                height = Number(self.heightCM()) / 100; // Converted to meter
            } else {
                weight = Number(self.weightPounds()) * 0.45359237;
                height = Number(self.heightFeet()) * 0.3048 + Number(self.heightInches()) * 0.0254;
            }
            // Check if weight and height are valid numbers
            if (isNaN(weight) || isNaN(height) || height === 0) {
                return "Invalid input";
            }

            // Calculate BMI
            let bmi = weight / (height * height);
            return bmi;
        }, this);
        self.BMICategory = ko.computed(function () {
            let BMIResult = self.BMIResult();

            if (isNaN(BMIResult) || BMIResult === "Invalid input") {
                return "Invalid input";
            } else if (BMIResult < 18.5) {
                return "Underweight";
            } else if (BMIResult >= 18.5 && BMIResult < 24.9) {
                return "Healthy Weight";
            } else if (BMIResult >= 24.9 && BMIResult < 30.0) {
                return "Overweight";
            } else {
                return "Obesity";
            }
        }, this);

        // BMI calculator mode switch
        self.metric = function () {
            self.MetricModeBMI(true);
            self.ImperialModeBMI(false);
        }
        self.imperial = function () {
            self.MetricModeBMI(false);
            self.ImperialModeBMI(true);
        }

        // Client-side routes
         let app = Sammy(function () {
            this.get('#/', function () {
                // Show the default section or handle navigation to the homepage
                self.chosenPage('#/home');
                $('.home').show();
                $('.BMI_Calculator, .calories_tracker').hide();
            });

            this.get('#/home', function () {
                self.chosenPage('#/home');
                $('.home').show();
                $('.BMI_Calculator, .calories_tracker').hide();
            });

            this.get('#/bmi-calculator', function () {
                self.chosenPage('#/bmi-calculator');
                $('.BMI_Calculator').show();
                $('.home, .calories_tracker').hide();
            });

            this.get('#/calories-tracker', function () {
                self.chosenPage('#/calories-tracker');
                $('.calories_tracker').show();
                $('.home, .BMI_Calculator').hide();
            });
        });

        // Start the Sammy app
        app.run('#/'); // Automatically adds the #/ to the URL
    };

    ko.applyBindings(new viewModel());

});