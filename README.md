# railmate-api

        "About" : "Documention for how to use the railmate API",
        "Endpoints" : [
            {
                "name" : "/stations",
                "link" : `http://localhost:${port}/stations`,
                "type" : "GET",
                "description" : "Gets all stations in the uk"
            },
            {
                "name" : "/livedepatures/[STATION_CODE]",
                "link" : `http://localhost:${port}/livedepatures/KGX`,
                "type" : "GET",
                "description" : "Gets all the depatures for a station based on it's station code"
            }
