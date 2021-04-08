import discord
from discord.ext import commands
import sys 

#TODO: help command
#TODO: save in file or storage
#TODO: full class list

charArray = [
    {"classNaming": ["KE", "KnightEmperor", "Elsword1"], "emoji": "<:KE:828899757359366166>"},
    {"classNaming": ["RM", "RuneMaster", "Elsword2"], "emoji": "<:RM:828906428584296470>"},
    {"classNaming": ["IM", "Immortal", "Elsword3"], "emoji": "<:IM:828906440948973568>"},

    {"classNaming": ["AeS", "AetherSage", "Aisha1"], "emoji": "<:AeS:828906464453066822>"},
    {"classNaming": ["OZ", "OzSorcerer", "Aisha2"], "emoji": "<:OZ:828906512742612992>"},
    {"classNaming": ["MtM", "Metamorphy", "Aisha3"], "emoji": "<:MtM:828906520639963197>"},

    {"classNaming": ["AN", "Anemos", "Rena1"], "emoji": "<:AN:828906527023824917>"},
    {"classNaming": ["DaB", "DayBreaker", "Rena2"], "emoji": "<:DaB:828906534837682176>"},
    {"classNaming": ["TW", "Twilight", "Rena3"], "emoji": "<:TW:828906542303805472>"},

    {"classNaming": ["FB", "FuriousBlade", "Raven1"], "emoji": "<:FB:828906550957572147>"},
    {"classNaming": ["RH", "RageHearts", "Raven2"], "emoji": "<:RH:828906557462806548>"},
    {"classNaming": ["NI", "NovaImperator", "Raven3"], "emoji": "<:NI:828906563854401557>"}

    {"classNaming": ["CU", "CodeUlimate", "Eve1"], "emoji": ""}
    {"classNaming": ["CE", "CodeEmpress", "Eve2"], "emoji": ""}
    {"classNaming": ["CS", "CodeSariel", "Eve3"], "emoji": ""}

    {"classNaming": ["CC", "CometCrusader", "Chung1"], "emoji": ""}
    {"classNaming": ["FP", "FatamPhantom", "Chung2"], "emoji": ""}
    {"classNaming": ["CeT", "Centurion", "Chung3"], "emoji": ""}

    {"classNaming": ["Aps", "Apsara", "Ara1"], "emoji": ""}
    {"classNaming": ["Devi", "Ara2"], "emoji": ""}
    {"classNaming": ["SH", "Shakti", "Ara3"], "emoji": ""}

    {"classNaming": ["ES", "EmpireSword", "Elesis1"], "emoji": ""}
    {"classNaming": ["FL", "FlameLord", "Elesis2"], "emoji": ""}
    {"classNaming": ["BQ", "BloodyQueen", "Elesis3"], "emoji": ""}
]

attributes = [
    {"name": "dps", "value": False, "set": True,  "emoji": "<:dps:828908669978673182>"},
    {"name": "sage", "value": False, "set": True, "emoji": "<:sage:828908664810373130>"},
    {"name": "fresh", "value": True, "set": True, "emoji": "<:fresh:828908656144678964>"},
    {"name": "flamemark", "value": False, "set": False, "emoji": "<:flamemark:828910673626923038>"}   
]

userRaidLists = {

}

def findElswordClass(elswordClass):
    for index, classTuple in enumerate(charArray):
        for classNaming in classTuple["classNaming"]:
            if classNaming.lower() == elswordClass.lower():
                return {"name": classTuple["classNaming"][0], "index": index}
    return None

def findEmojiByClassName(elswordClass):
    realName = findElswordClass(elswordClass)
    if not realName:
        return None
    realName = realName["name"]
    for classTuple in charArray:
       if realName == classTuple["classNaming"][0]:
           return classTuple["emoji"]
    return None

def findEmojiByAttributeName(attribute):
    for attributeTuple in attributes:
        if attribute == attributeTuple["name"]:
            return attributeTuple["emoji"]
    return None

def checkUserListHasChar(user, className):
    userList = userRaidLists[user]
    for index, classDef in enumerate(userList):
        if classDef["className"].lower() == className.lower():
            return index
    return -1

async def doIfUserFoundInUserList(ctx, successFunction, failureFunction):
    if not ctx.author in userRaidLists:
        await failureFunction(ctx)
    else:
        await successFunction(ctx)

async def doIfClassFoundInUserList(ctx, className, successFunction, failureFunction, userNotFoundFunction):
    realName = findElswordClass(className)

    if not realName:
        await ctx.send(className + ": class not found")
        return

    realName = realName["name"]

    async def userFound(ctx):
        index = checkUserListHasChar(ctx.author, realName)
        if index == -1:
            await failureFunction(ctx, realName)
        else:
            await successFunction(ctx, index, realName)

    async def userNotFound(ctx):
        await userNotFoundFunction(ctx, realName)

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)

def userListToServerList(user):
    if not user in userRaidLists:
        return "You have no list yet"

    userList = userRaidLists[user]
    userList.sort(key = lambda charDef: 1 if charDef["fresh"] else -1)

    raidString = ""
    mustIncludeFlameMark = False
    for index, classDef in enumerate(userList):
        if (classDef['fresh'] or classDef['farm']):
            if (not classDef['fresh']):
                mustIncludeFlameMark = True
            if (classDef['fresh'] and index > 0 and not userList[index - 1]['fresh'] and mustIncludeFlameMark):
                raidString += findEmojiByAttributeName("flamemark") + ' '
            raidString += classDef["emoji"] + ' '
            if (classDef['dps']):
                raidString += findEmojiByAttributeName("dps") + ' '
            if (classDef['sage']):
                raidString += findEmojiByAttributeName("sage") + ' '
        if (not classDef['fresh'] and index + 1 == len(userList) and mustIncludeFlameMark):
            raidString += findEmojiByAttributeName("flamemark") + ' '
        if (classDef['fresh'] and index + 1 == len(userList)):
            raidString += findEmojiByAttributeName("fresh") + ' '

    return raidString if raidString else "Your list is empty"

client = commands.Bot(command_prefix = "?", description = "Rosso raid list manager")

@client.event
async def on_ready():
    print("ready")

@client.command()
async def add(ctx, *args):
    async def classFound(ctx, index, realName):
        await ctx.send("You already added " + realName + " to your list")
    
    async def classNotFound(ctx, realName):
        userRaidLists[ctx.author] = userRaidLists[ctx.author] + [{"className": realName, "emoji": findEmojiByClassName(realName), "dps": False, "sage": False, "fresh": True, "farm": False}]

    async def userNotFound(ctx, realName):
        userRaidLists[ctx.author] = [{"className": realName, "emoji": findEmojiByClassName(realName), "dps": False, "sage": False, "fresh": True, "farm": False}]

    for className in args:
        await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

    await ctx.send(userListToServerList(ctx.author))

@client.command()
async def remove(ctx, *args):
    async def successfullDelete(ctx, index, realName):
        del userRaidLists[ctx.author][index]

    async def failureDelete(ctx, realName):
        await ctx.send(realName + " was not fount in your list")

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    for className in args:
        await doIfClassFoundInUserList(ctx, className, successfullDelete, failureDelete, userNotFound)

    await ctx.send(userListToServerList(ctx.author))

@client.command()
async def set(ctx, className, *args):
    async def setAttribute(ctx, index, realName):
        if len(args) > 2 or (len(args) == 2 and (args[0] != "not")):
            await ctx.send("Bad syntax, use the help command for more information")
            return

        attribute = args[0] if len(args) == 1 else args[1]
        attributeValue = True if len(args) == 1 else False

        if not attribute in userRaidLists[ctx.author][index]:
            await ctx.send("Bad syntax, use the help command for more information")
            return

        userRaidLists[ctx.author][index][attribute] = attributeValue
        await ctx.send(userListToServerList(ctx.author))

    async def classNotFound(ctx, realName):
        await ctx.send(realName + " was not fount in your list")
        await ctx.send(userListToServerList(ctx.author))

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    await doIfClassFoundInUserList(ctx, className, setAttribute, classNotFound, userNotFound)

@client.command()
async def run(ctx, *args):
    async def classFound(ctx, index, realName):
        if userRaidLists[ctx.author][index]["fresh"] == 0:
            await ctx.send("You have already run rosso on " + className)
            return

        userRaidLists[ctx.author][index]["fresh"] -= 1

    async def classNotFound(ctx, realName):
        await ctx.send(realName + " was not fount in your list")

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    for className in args:
        await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

    await ctx.send(userListToServerList(ctx.author))

@client.command()
async def raidList(ctx):
    await ctx.send(userListToServerList(ctx.author))

@client.command()
async def list(ctx):
    async def userFound(ctx):
        userList = userRaidLists[ctx.author]
        userList.sort(key = lambda charDef: findElswordClass(charDef["className"])["index"])
        listStr = ""
        for classDef in userRaidLists[ctx.author]:
            listStr += "\n" + classDef["emoji"]
        await ctx.send(listStr)

    async def userNotFound(ctx):
        await ctx.send("You have no list yet")

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)

@client.command()
async def weeklyreset(ctx):
    async def userFound(ctx):
        for index, whatever in enumerate(userRaidLists[ctx.author]):
            userRaidLists[ctx.author][index]["fresh"] = True
        await ctx.send(userListToServerList(ctx.author))

    async def userNotFound(ctx):
        await ctx.send("You have no list yet")

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)

@client.command()
async def on_command_error(ctx, error):
    if isinstance(error, discord.ext.commands.error.CommandNotFound):
        await ctx.send("This command doesn't exist")
    if isinstance(error, discord.ext.commands.error.MissingRequiredArgument):
        await ctx.send("Missing required argument")

client.run('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo')