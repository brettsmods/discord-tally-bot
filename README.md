# [Tally Bot](https://top.gg/bot/494241511714586634)
Tally Bot is built around keeping track of _stuff_. Like, how many times your coworker is late for a meeting, or how many times your guild wipes at 1%. Whatever you want. It also supports announcing events as well as timing whatever you want. It's highly customizable and 99.99% highly available 24/7.

Have fun! Don't forget to provide feedback using `!tb bug` or `!tb suggest` (see below for more info).

## Tip Jar
If you like Tally Bot and would like to see its continued support and development, feel free 
to send some beer money this way -> https://paypal.me/ryanpage42

This will help offset the cost of running the bot. Thank you 👊

## Changelog
[Click here](https://github.com/ryanpage42/discord-tally-bot/blob/master/CHANGELOG.md)

# Commands
Cases where `[]` is shown should be replaced in its entirety with the value it represents. (i.e `!tb add my-tally` or `!tb rm my-tally`)

- [General Commands](#General)
  - [Get Help](#get-help)
  - [Invite Bot](#invite-bot)
  - [Make a Feature Request](#make-a-feature-request)
  - [Make a Bug Report](#make-a-bug-report)
- [Permissions](#permissions)
  - [Set All Permissions](#set-all-permissions)
  - [Set a Specific Permission](#set-a-specific-permission)
  - [Display Permissions](#display-permissions)
  - [Grant Permission Granter](#granting-permission-admin-access)
- [Tallies](#tallies)
  - [Channel vs Global](#channel-vs-global)
  - [Create a Tally](#create-a-tally)
  - [Create a Keyword Tally](#create-a-keyword-tally)
  - [Create a Keyword Dump Tally](#create-a-keyword-dump-tally)
  - [Make Tally Globally Visible](#make-a-tally-globally-visible)
  - [Make Tally Channel Visible](#make-a-tally-channel-visible)
  - [Change Tally Description](#change-tally-description)
  - [Increase Tally](#increase-a-tally)
  - [Decrease Tally](#decrease-a-tally)
  - [Set Tally Count](#set-a-tallys-count)
  - [Show All Tallies](#show-all-tallies)
  - [Get Tally Details](#get-tally-details)
  - [Delete Tally](#delete-a-tally)
  - [Delete All Tallies](#delete-all-tallies)
  - [Reset Tally](#reset-tally-to-0)
  - [Reset All Tallies](#reset-all-tallies-to-0)
- [Announcements](#announcements)
  - [Create Announcement](#create-an-announcement)
  - [Set Announcement Tally Goal](#set-announcement-tally-goal)
  - [Set Announcement Date Goal](#set-an-announcement-date)
  - [Set Announcement Cron](#set-an-announcement-cron)
  - [Stop Announcement](#stop-announcement)
  - [Delete Announcement](#delete-announcement)
  - [Activate Announcement](#activate-announcement)
- [Timers](#timers)
  - [List Timers](#list-timers)
  - [Create Timer](#create-a-timer)
  - [Delete a Timer](#delete-a-timer)
  - [Start a Timer](#start-a-timer)
  - [Stop a Timer](#stop-a-timer)
  - [Reset a Timer](#reset-a-timer)

## General
`!tb` - This is the prefix. All commands should lead with this followed by a space. For example: `!tb show`

### **Get Help**
This will send you back here.

    !tb help

### **Invite Bot**
This will send you back here.

    !tb invite


### **Make a Feature Request**
Want to see somethings added? Just use this command to open a request.

    !tb suggest [suggestion]

    ---- examples ----
    !tb suggest Have you tried not sucking?

### **Make a Bug Report**
Use this to let me know if there is anything messed up with the bot.

    !tb bug [report]

    !tb report [report]

    ---- examples ----
    !tb bug This bug is broken!

    !tb report It's still broken!

## Permissions
On installation, Tally Bot will allow any user to run any command. Admins can set permissions for commands to allow only users with a certain role to run them.

### **Set All Permissions**
Set all permissions to a specific server role. Server administrators can _always_ run this.

    !tb -role [Role]

    ---- examples ----
    !tb -role MyRole

### **Set A Specific Permission**
Set a permission for a specific command. Server administrators can _always_ run this.

    !tb [command] -role [Role]

    ---- examples ----
    !tb bump -role MyRole

### **Display Permissions**
Display all current permissions.

    !tb permissions

    ---- examples ----
    !tb permissions

### **Granting Permission Admin Access**
If you would like to grant users the ability to change permission levels, you can run the following. This is rather clunky and I have plans on improving this syntax, but it works. 😉

    !tb -role -role [Role]

    ---- examples ----
    !tb -role -role MyRole

## Tallies

### **Channel vs Global**
Tallies are defined as *Channel Tallies* when initially created. You will see that identified by **[C]** in the relevant commands. You are also allowed to convert these to *Global Tallies* identified by **[G]**.

All relevent tally commands can be either used for channel tallies or global tallies. Simply add `-g` after the command.

For example, if I wanted to bump a **global** tally named *test*, I would issue this command

    !tb bump -g test

### **Create A Tally**
Create a tally that has a specified _name_ and _description_. A name is a unique identifier that is used to increase or decrease the tally's _count_. Tally counts can be positive or negative.

    !tb create [name] [description]
    -or-
    !tb add [name] [description]

    ---- examples ----
    !tb create test-tally My tally that I will count things with.
    
    !tb add test-tally My tally that I will count things with.

### **Create a Keyword Tally**
Create a tally that has all the attributes of the above regular tally, but can be configured to increase or decrease based off of a _keyword_. A keyword is a word (or words) that will trigger this event.

    !tb keyword [name] [keyword] [description]
    -or-
    !tb kw [name] [keyword] [description]

    ---- examples ----
    !tb keyword my-kw-tally poisoned Trigger everytime someone has been poisoned.
    
    !tb kw my-kw-tally poisoned,cursed,dead Trigger everytime someone has been poisoned, cursed, or dies.

### **Create a Keyword Dump Tally**
This tally has all the attributes of a regular keyword tally, but will _decrease_ the tally when the keyword event is fired.

    !tb keyword dump [name] [keyword] [description]
    -or-
    !tb kw dump [name] [keyword] [description]

    ---- examples ----
    !tb keyword dump my-kw-tally poisoned Trigger everytime someone has been poisoned.
    
    !tb kw dump my-kw-tally poisoned,cursed,dead Trigger everytime someone has been poisoned, cursed, or dies.

### **Make a Tally Globally Visible**
Convert a Tally to be globally scoped. If a tally already exists in the current global scope with the specified _name_ provided, then it will error.

    !tb global [name]

    ---- examples ----
    !tb global my-tally

### **Make a Tally Channel Visible**
Convert a Tally to be channel scoped. If a tally already exists in the current global scope with the specified _name_ provided, then it will error.

    !tb channel [name]

    ---- examples ----
    !tb channel my-tally

### **Change Tally Description**
Update a tally's description. Note, this will work on all tally types.

    !tb describe [name] [description]
    -or-
    !tb update [name] [description]

    ---- examples ----
    !tb describe my-tally Wow a brand new tally description!

    !tb update my-tally Wow another brand new tally description!!! :)

### **Increase a Tally**
Tallies can be increased by one (default) or by an amount.

    !tb bump [name]
    -or-
    !tb bump [name] [amount]

    ---- example ----
    !tb bump my-tally

    !tb bump my-tally 100

### **Decrease a Tally**
Tallies can be decreased by one (default) or by an amount.

    !tb dump [name]
    -or-
    !tb dump [name] [amount]

    ---- example ----
    !tb dump my-tally

    !tb dump my-tally 100

### **Set a Tally's Count**
Manually set a tally to be a specific count.

    !tb set [name] [count]

    ---- examples ----
    !tb set my-tally 100


### **Show All Tallies**
List all tallies created in this channel.

    !tb show

    ---- examples ----
    !tb show

### **Get Tally Details**
Get the details of a created tally.

    !tb details [name]
     -or-
    !tb get [name]

    ---- examples ----
    !tb details my-tally

    !tb get my-tally

### **Delete A Tally**
Delete a tally. This actually, sincerely, will destroy the record in the database _permanently_. I do have plans to add a restore functionality but it's not implemented yet.

    !tb delete [name]
    -or-
    !tb rm [name]

    ---- examples ----
    !tb delete my-tally

    !tb rm my-tally

### **Delete all Tallies**
Same as above but will delete all channel/global tallies.

    !tb delete-all

    ---- examples ----
    !tb delete-all

### **Reset Tally to 0**
You can empty a tally and set the value to 0.

    !tb empty [name]

    ---- examples ----
    !tb empty my-tally

### **Reset All Tallies to 0**
You can also reset all tallies to 0.

    !tb empty-all

    ---- examples ----
    !tb empty-all

## Announcements
All announcement schedules are run in `America/Los_Angeles` timezone. I have plans to do channel specific timezones but it is low priority. Please schedule accordingly!

### **Show Announcements**
List all announcements created for this channel.

    !tb announcements

### **Create an Announcement**
Create an announcement with a _name_ and _description_. This command can also be used to update the description of an existing announcement.

    !tb announce [name] [description]

    ---- examples ----
    !tb announce new-years In the future!

### **Set Announcement Tally Goal**
You can set an announcement to fire when a tally reaches a certain goal.

    !tb announce [name] -t [tally name] [tally goal]

    ---- examples ----
    !tb announce new-record -t ryan-apm 9001

### **Set an Announcement Date**
You can also set an announcement to fire on a specific date. [See here for help](https://www.w3schools.com/js/js_date_formats.asp)

    !tb announce [name] -d [date]

    ---- examples ----
    !tb announce new-years -d 01-01-2042

### **Set an Announcement Cron**
If you are looking to set a repeating announcement, then you can use cron expressions. [See here for help](https://crontab.guru/)

    !tb announce [name] -d [cron]

    ---- examples ----
    !tb announce new-years -d 0 0 1 1 *

### **Stop Announcement**
Stop an announcement from running anymore.

    !tb announce [name] -kill

    ---- examples ----
    !tb announce new-years -kill


### **Delete Announcement**
Delete an announcement from the database. 

    !tb announce [name] -delete

    ---- examples ----
    !tb announce new-years -delete

### **Activate Announcement**
Activate an announcement to be able to run again.

    !tb announce [name] -activate

    ---- examples ----
    !tb announce new-years -activate

## Timers

### **List Timers**
List all timers created in this channel.

    !tb timers 

### **Create a Timer**
Create a new timer with a _name_ and an optional _description_. 

    !tb timer [name] [description]

    ---- examples ----
    !tb timer my-timer It times stuff!

### **Delete a Timer**
Delete a timer from the database.

    !tb timer rm [name]
    
    ---- examples ----
    !tb timer rm my-timer

### **Start a Timer**
Start a timer.

    !tb start [name]

    ---- examples ----
    !tb start my-timer

### **Stop a Timer**
Stop a timer.

    !tb stop [name]

    ---- examples ----
    !tb stop my-timer

### **Reset a Timer**
Reset a timer to 0:00

    !tb reset [name]

    ---- examples ----
    !tb reset my-timer
