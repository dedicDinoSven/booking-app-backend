const seeder = require('mongoose-seed');
const mongo = '';
// mongodb+srv://root:root@cluster0.w9kzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
seeder.connect(mongo, function () {
	seeder.loadModels(['./models/amenity', './models/propertyType']);

	seeder.clearModels(['Amenity', 'PropertyType'], () => {
		seeder.populateModels(data, (err, done) => {
			if (err) {
				return console.log('Seed error: ', err);
			}
			if (done) {
				return console.log('Seed done: ', done);
			}

			seeder.disconnect();
		});
	});
});

const data = [
	{
		'model': 'Amenity',
		'documents': [
			{ 'name': 'Kitchen' },
			{ 'name': 'Heating' },
			{ 'name': 'Air conditioning' },
			{ 'name': 'Washer' },
			{ 'name': 'Dryer' },
			{ 'name': 'Wifi' },
			{ 'name': 'Breakfast' },
			{ 'name': 'Iron' },
			{ 'name': 'Hair dryer' },
			{ 'name': 'TV' },
			{ 'name': 'Crib' },
			{ 'name': 'Parking' },
			{ 'name': 'Hot tub' },
			{ 'name': 'Pool' },
			{ 'name': 'EV charger' },
			{ 'name': 'Gym' },
		],
	},
	{
		'model': 'PropertyType',
		'documents': [
			{
				'name': 'Apartment',
				'description':
					'Furnished, independent accommodations available for short- and long-term rental',
			},
			{
				'name': 'Vacation home',
				'description':
					'Freestanding home with private, external entrance and rented specifically for vacation',
			},
			{
				'name': 'Villa',
				'description':
					'Private, freestanding and independent home with a luxury feel',
			},
			{
				'name': 'Condo hotel',
				'description':
					'Independent apartments with some hotel facilities like a front desk',
			},
			{
				'name': 'Resort village',
				'description':
					'Private independent residences located on shared grounds with shared facilities or recreational activities',
			},
			{
				'name': 'Guest house',
				'description':
					'Private home with separate living facilities for host and guest',
			},
			{
				'name': 'Bed and breakfast',
				'description': 'Private home offering overnight stays and breakfast',
			},
			{
				'name': 'Homestay',
				'description':
					'A shared home where the guest has a private room and the host lives and is on site. Some facilities are shared between hosts and guests.',
			},
			{
				'name': 'Country house',
				'description':
					'Private home in the countryside with simple accommodations',
			},
			{
				'name': 'Lodge',
				'description':
					'Private home with accommodations surrounded by nature, such as a forest or mountains',
			},
			{
				'name': 'Hotel',
				'description':
					'Accommodations for travelers often with restaurants, meeting rooms and other guest services',
			},
			{
				'name': 'Hostel',
				'description':
					'Budget accommodations with mostly dorm-style beds and social atmosphere',
			},
			{
				'name': 'Resort',
				'description':
					'A place for relaxation with on-site restaurants, activities and often a luxury feel',
			},
			{
				'name': 'Campground',
				'description':
					'Accommodations offering cabins or bungalows alongside areas for camping or campers, with shared facilities or recreational activities',
			},
			{
				'name': 'Boat',
				'description': 'Commercial travel accommodations located on a boat',
			},
		],
	},
];
