import discord
from discord.ext import commands
import sys 

#TODO: help command
#TODO: save in file or storage
#TODO: Stone attributes and emojis
#TODO: create char array according to attribute array
#TODO: implement get name in findEmojiByAttributeName

charArray = [
    #Elsword
    {"classNaming": ["KE", "KnightEmperor", "Elsword1"], "emoji": "<:KE:828899757359366166>"},
    {"classNaming": ["RM", "RuneMaster", "Elsword2"], "emoji": "<:RM:828906428584296470>"},
    {"classNaming": ["IM", "Immortal", "Elsword3"], "emoji": "<:IM:828906440948973568>"},

    #Aisha
    {"classNaming": ["AeS", "AetherSage", "Aisha1"], "emoji": "<:AeS:828906464453066822>"},
    {"classNaming": ["Oz", "OzSorcerer", "Aisha2"], "emoji": "<:OZ:828906512742612992>"},
    {"classNaming": ["MtM", "Metamorphy", "Aisha3"], "emoji": "<:MtM:828906520639963197>"},

    #Rena
    {"classNaming": ["AN", "Anemos", "Rena1"], "emoji": "<:AN:828906527023824917>"},
    {"classNaming": ["DaB", "DayBreaker", "Rena2"], "emoji": "<:DaB:828906534837682176>"},
    {"classNaming": ["TW", "Twilight", "Rena3"], "emoji": "<:TW:828906542303805472>"},

    #Raven
    {"classNaming": ["FB", "FuriousBlade", "Raven1"], "emoji": "<:FB:828906550957572147>"},
    {"classNaming": ["RH", "RageHearts", "Raven2"], "emoji": "<:RH:828906557462806548>"},
    {"classNaming": ["NI", "NovaImperator", "Raven3"], "emoji": "<:NI:828906563854401557>"},

    #Eve
    {"classNaming": ["CU", "CodeUlimate", "Eve1"], "emoji": "<:CU:829692771001434123>"},
    {"classNaming": ["CE", "CodeEmpress", "Eve2"], "emoji": "<:CE:829692784616144937>"},
    {"classNaming": ["CS", "CodeSariel", "Eve3"], "emoji": "<:CS:829692792996626492>"},

    #Chung
    {"classNaming": ["CC", "CometCrusader", "Chung1"], "emoji": "<:CC:829692798965907506>"},
    {"classNaming": ["FP", "FatamPhantom", "Chung2"], "emoji": "<:FP:829692805261426768>"},
    {"classNaming": ["CeT", "Centurion", "Chung3"], "emoji": "<:CeT:829692812248350740>"},

    #Ara
    {"classNaming": ["Aps", "Apsara", "Ara1"], "emoji": "<:Aps:829692821556297768>"},
    {"classNaming": ["Devi", "Ara2"], "emoji": "<:Devi:829692829151526953>"},
    {"classNaming": ["Shakti", "SH", "Ara3"], "emoji": "<:SH:829692836790009856>"},

    #Elesis
    {"classNaming": ["ES", "EmpireSword", "Elesis1"], "emoji": "<:ES:829692843583864833>"},
    {"classNaming": ["FL", "FlameLord", "Elesis2"], "emoji": "<:FL:829692850333417493>"},
    {"classNaming": ["BQ", "BloodyQueen", "Elesis3"], "emoji": "<:BQ:829692858138099713>"},

    #Add
    {"classNaming": ["DB", "DoomBringer", "Add1"], "emoji": "<:DB:829692865458339840>"},
    {"classNaming": ["DoM", "Dominator", "Add2"], "emoji": "<:DoM:829692872197668884>"},
    {"classNaming": ["MP", "MadParadox", "Add3"], "emoji": "<:MP:829692880179298334>"},

    #Luciel
    {"classNaming": ["CaT", "Catastrophe", "Luciel1"], "emoji": "<:CaT:829692887818174484>"},
    {"classNaming": ["IN", "Innocent", "Luciel2"], "emoji": "<:IN:829692895664930816>"},
    {"classNaming": ["DiA", "Diangelion", "Luciel3"], "emoji": "<:DiA:829692905031073842>"},

    #Rose
    {"classNaming": ["TB", "TempestBurster", "Rose1"], "emoji": "<:TB:829692997171806218>"},
    {"classNaming": ["BlM", "BM", "BlackMassacre", "Rose2"], "emoji": "<:BlM:829693008319610920>"},
    {"classNaming": ["MN", "Minerva", "Rose3"], "emoji": "<:MN:829693015697260544>"},
    {"classNaming": ["PO", "PrimeOperator", "Rose4"], "emoji": "<:PO:829693022211014677>"},

    #Ain
    {"classNaming": ["RI", "Richter", "Ain1"], "emoji": "<:RI:829693030138642453>"},
    {"classNaming": ["BL", "Bluhen", "Ain2"], "emoji": "<:BL:829693036996460576>"},
    {"classNaming": ["HR", "Herrscher", "Ain3"], "emoji": "<:HR:829693044478443580>"},

    #Laby
    {"classNaming": ["EtW", "EternityWinner", "Laby1"], "emoji": "<:EtW:829693052670312499>"},
    {"classNaming": ["RaS", "RadiantSoul", "Laby2"], "emoji": "<:RaS:829693063508656140>"},
    {"classNaming": ["NL", "Nisha", "NishaLabyrinth", "Laby3"], "emoji": "<:NL:829693114222379008>"},

    #Noah
    {"classNaming": ["LB", "Liberator", "Noah1"], "emoji": "<:LB:829693124698832936>"},
    {"classNaming": ["CL", "Celestia", "Noah2"], "emoji": "<:CL:829693133171326978>"},
    {"classNaming": ["NP", "NyxPieta", "Noah3"], "emoji": "<:NP:829693142995435582>"},
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

def userListToServerList(user, emojis = True):
    if not user in userRaidLists:
        return "You have no list yet"

    userList = userRaidLists[user]

    raidString = "" if emojis else "```"
    mustIncludeFlameMark = False
    for index, classDef in enumerate(userList):
        if (classDef['fresh'] or classDef['farm']):
            if (not classDef['fresh']):
                mustIncludeFlameMark = True
            if ((not classDef['fresh']) and index > 0 and userList[index - 1]['fresh']):
                raidString += findEmojiByAttributeName("fresh") + ' ' if emojis else ':fresh: '
            if (classDef['fresh'] and index > 0 and not userList[index - 1]['fresh'] and mustIncludeFlameMark):
                raidString += findEmojiByAttributeName("flamemark") + ' ' if emojis else ':flamemark: '
            if (classDef['fresh']):
                mustIncludeFlameMark = False
            raidString += classDef["emoji"] + ' ' if emojis else ':' + classDef["className"] + ': '
            if (classDef['dps']):
                raidString += findEmojiByAttributeName("dps") + ' ' if emojis else ':dps: '
            if (classDef['sage']):
                raidString += findEmojiByAttributeName("sage") + ' ' if emojis else ':FullSage: '
            if (not classDef['fresh'] and index + 1 == len(userList) and mustIncludeFlameMark):
                raidString += findEmojiByAttributeName("flamemark") + ' ' if emojis else ':flamemark: '
            if (classDef['fresh'] and index + 1 == len(userList)):
                raidString += findEmojiByAttributeName("fresh") + ' ' if emojis else ':fresh: '

    if (raidString == "```"):
        raidString += " "
    return (raidString if emojis else raidString + "```") if raidString else "Your list is empty"

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
        invertAttr = False
        for attr in args:
            if attr == 'not':
                invertAttr = True
                await ctx.send("invert")
                continue

            attribute = attr
            await ctx.send("Attribute = " + attribute)
            attributeValue = not invertAttr

            if not attribute in userRaidLists[ctx.author][index]:
                await ctx.send("Bad syntax, use the help command for more information")
            
            await ctx.send("Setting attribute " + attribute + " as " + str(attributeValue))
            userRaidLists[ctx.author][index][attribute] = attributeValue
            invertAttr = False

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
async def list(ctx):
    async def userFound(ctx):
        userList = userRaidLists[ctx.author]
        userList.sort(key = lambda charDef: findElswordClass(charDef["className"])["index"])
        listStr = ""
        for classDef in userRaidLists[ctx.author]:
            listStr += classDef["emoji"] + " "
        await ctx.send("Your Character(s): " + listStr)

    async def userNotFound(ctx):
        await ctx.send("You have no list yet")

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)
    await ctx.send("List: " + userListToServerList(ctx.author))
    await ctx.send("Raid Server List: " + userListToServerList(ctx.author, False))

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