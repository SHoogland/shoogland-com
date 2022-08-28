---
description: Scriptable widget with gripp api
date: 2022-06-13T12:00:00+0000

meta:
  - name: keywords
    content: 2022 iphone gripp api scriptable ios firebase

feed:
  enable: true
---

# Scriptable gripp widget
I was looking for a way to show my work planning in a simple format on my phone. the Scriptable app together with the GRIPP api turned out to be a great solution.

<image-element source="2022/scriptable-ios-screenshot" width="375" height="812" alt="IOS screenshot with the scriptable widgets" type="png" />

## scriptable code

```js
class GrippWidget {
	async run() {
		let widget = await this.deployWidget();
		if (!config.runsInWidget) {
			widget.presentSmall()
		}
		Script.setWidget(widget);
		Script.complete();
	}

	async loadDocs() {
		// I use a small firebase function to act as a cache layer between the ios widget and gripp, so I only call the api at most once every hour
		let url = "https://[redacted].cloudfunctions.net/gripp?employee=[redacted]&what=today"
		let req = new Request(url)
		req.method = "GET";
		return await req.loadJSON()
	}

	async deployWidget() {
		let list = new ListWidget();
		list.setPadding(12, 12, 12, 12);

		let titleTxt = list.addText("GRIPP TODAY");
		titleTxt.font = Font.mediumSystemFont(13);

		list.addText("");

		let api = await this.loadDocs();
		for (let i = 0; i < api.length; i++) {
			console.log(api[i])
			let daysLeftTxt = list.addText(api[i].company + " - " + api[i].hours);
			daysLeftTxt.textColor = Color.blue();
			daysLeftTxt.font = Font.boldSystemFont(10);
			daysLeftTxt = list.addText(api[i].project + " - " + api[i].subject);
			daysLeftTxt.textColor = Color.orange();
			daysLeftTxt.font = Font.boldSystemFont(5);
		}
		return list
	}
}

await new GrippWidget().run();
```

### firebase function
the cache middleware

```js
const axios = require('axios');

exports.handler = async (req, res) => {

	let employee = req.query.employee
	let what = req.query.what

	if (!employee || !what) {
		res.json('error');
		return;
	}

	let d = new Date();

	let data = []
	if (what === 'tomorrow') {
		let tomorrow = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate() + 1)
		data = await getTasks(employee, tomorrow)
	} else if (what === 'today') {
		let today = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
		data = await getTasks(employee, today)
	}

	res.set('Cache-Control', 'public, max-age=60, s-maxage=3600');

	res.json(data);
};

async function getTasks(employee, day) {
	let formattedTasks = []

	let result = await callGripp([
		{
			"method": "calendaritem.get",
			"params": [
				[
					{
						"field": "calendaritememployee.id",
						"operator": "equals",
						"value": employee
					},
					{
						"field": "calendaritem.date",
						"operator": "between",
						"value": day,
						"value2": day
					}
				],
				{
					"paging": {
						"firstresult": 0,
						"maxresults": 10
					},
					"orderings": [
						{
							"field": "calendaritem.date",
							"direction": "desc"
						}
					]
				}
			],
			"id": 1
		}
	])
	let tasks = result[0].result.rows

	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		let formattedTask = {
			subject: task.subject,
			hours: task.hours
		};

		if (task.task) {
			let taskDetails = await callGripp([
				{
					"method": "task.getone",
					"params": [
						[
							{
								"field": "task.id",
								"operator": "equals",
								"value": task.task.id
							}
						]
					],
					"id": 1
				}
			])
			formattedTask.company = taskDetails[0].result.rows[0].company.searchname
			formattedTask.project = taskDetails[0].result.rows[0].offerprojectbase.searchname
		}
		formattedTasks.push(formattedTask)
	}

	return formattedTasks
}

async function callGripp(data) {
	let result = await axios({
		method: 'post',
		url: 'https://api.gripp.com/public/api3.php',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer [redacted]"
		},
		data
	}).catch(e => {
		console.error(e);
	});

	return result.data
}
```

<disqus />
