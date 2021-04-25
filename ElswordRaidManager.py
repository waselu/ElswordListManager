import discord
from discord.ext import commands
import sys
import json

##Usable by other users##
#TODO: help command
#TODO: sort (autosort) command

##Mandatory##
#Nothing

##LONG TERM##
#TODO: set/addlist command (example: setlist cl sage reset ke dps tw yellow)

##Propreté du code##
#TODO: implement get name in findEmojiByAttributeName (allow list(emoji = False) to use functions instead of plain strings in list)

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
    {"name": "dps", "value": False, "canSet": True, "isDefault": True,  "emoji": "<:dps:828908669978673182>"},
    {"name": "sage", "value": False, "canSet": True, "isDefault": True, "emoji": "<:sage:828908664810373130>"},
    {"name": "farm", "value": False, "canSet": True, "isDefault": True, "emoji": ""},

    #Canrun attributes
    {"name": "fresh", "value": True, "canSet": True, "isDefault": True, "emoji": "<:fresh:828908656144678964>"},
    {"name": "reset", "value": False, "canSet": True, "isDefault": True, "emoji": "<:reset:832571110906003496>"},
    {"name": "flamemark", "value": False, "canSet": False, "isDefault": False, "emoji": "<:flamemark:828910673626923038>"},

    #Stone attributes
    {"name": "stone", "value": None, "canSet": False, "isDefault": True, "emoji": ""}, #attribute
    {"name": "red", "value": None, "canSet": True, "isDefault": False, "emoji": "<:redcrystal:830525849391464511>"},
    {"name": "blue", "value": None, "canSet": True, "isDefault": False, "emoji": "<:bluecrystal:830525860418551899>"},
    {"name": "yellow", "value": None, "canSet": True, "isDefault": False, "emoji": "<:yellowcrystal:830525869487161354>"},
    {"name": "giant", "value": None, "canSet": True, "isDefault": False, "emoji": "<:giantcrystal:830525874007965766>"},
    {"name": "nostone", "value": None, "canSet": True, "isDefault": False, "emoji": ""}
]

userRaidLists = {
    
}

def loadUserFile():
    with open('ElswordTest.txt', "r") as f:
        global userRaidLists
        data = f.read()
        data = json.loads(data)
        userRaidLists = data

def saveUserFile():
    with open('ElswordTest.txt', "w+") as f:
        data = json.dumps(userRaidLists)
        f.seek(0)
        f.write(data)
        f.truncate()

loadUserFile()

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
    if not ctx.author.name in userRaidLists:
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
        index = checkUserListHasChar(ctx.author.name, realName)
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

    userList = userRaidLists[user].copy()
    for classDef in userRaidLists[user]:
        if not classDef['fresh'] and not classDef['reset'] and not classDef['farm']:
            userList.remove(classDef)

    raidString = "" if emojis else "```"
    mustIncludeFlameMark = False
    for index, classDef in enumerate(userList):
        if (classDef['fresh'] or classDef['reset'] or classDef['farm']):
            raidString += classDef["emoji"] + ' ' if emojis else ':' + classDef["className"] + ': '
            if (classDef['dps']):
                raidString += findEmojiByAttributeName("dps") + ' ' if emojis else ':dps: '
            if (classDef['sage']):
                raidString += findEmojiByAttributeName("sage") + ' ' if emojis else ':FullSage: '
            if (classDef['stone'] != None and (classDef['fresh'] or classDef['reset'])):
                raidString += findEmojiByAttributeName(classDef['stone']) + ' ' if emojis else ':' + classDef['stone'] + 'crystal: '
            if (index < len(userList) and (index == len(userList) - 1 or classDef['fresh'] != userList[index + 1]['fresh'] or classDef['reset'] != userList[index + 1]['reset'])):
                if classDef['fresh']:
                    raidString += findEmojiByAttributeName("fresh") + ' ' if emojis else ':fresh: '
                elif classDef['reset']:
                    raidString += findEmojiByAttributeName("reset") + ' ' if emojis else ':reset: '
                else:
                    raidString += findEmojiByAttributeName("flamemark") + ' ' if emojis else ':flamemark: '

    if (raidString == "```"):
        raidString += " "
    return (raidString if emojis else raidString + "```") if raidString else "Your list is empty"

client = commands.Bot(command_prefix = "?", description = "Rosso raid list manager")

@client.event
async def on_ready():
    print("ready")

@client.command()
async def add(ctx, *args):
    attributesArray = {}
    for attributeDef in attributes:
        if attributeDef["isDefault"]:
            attributesArray[attributeDef["name"]] = attributeDef["value"]

    async def classFound(ctx, index, realName):
        await ctx.send("You already added " + realName + " to your list")
    
    async def classNotFound(ctx, realName):
        classDef = {"className": realName, "emoji": findEmojiByClassName(realName)}
        classDef.update(attributesArray)
        userRaidLists[ctx.author.name] = userRaidLists[ctx.author.name] + [classDef]

    async def userNotFound(ctx, realName):
        classDef = {"className": realName, "emoji": findEmojiByClassName(realName)}
        classDef.update(attributesArray)
        userRaidLists[ctx.author.name] = [classDef]

    for className in args:
        await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

    await ctx.send(userListToServerList(ctx.author.name))
    saveUserFile()

@client.command()
async def remove(ctx, *args):
    async def successfullDelete(ctx, index, realName):
        del userRaidLists[ctx.author.name][index]

    async def failureDelete(ctx, realName):
        await ctx.send(realName + " was not fount in your list")

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    for className in args:
        await doIfClassFoundInUserList(ctx, className, successfullDelete, failureDelete, userNotFound)

    await ctx.send(userListToServerList(ctx.author.name))
    saveUserFile()

@client.command()
async def set(ctx, className, *args):
    def canSetAttribute(attribute):
        for attributeDef in attributes:
            if attributeDef['name'] == attribute:
                return attributeDef['canSet']
        return False

    def callFresh(classDef, invert):
        return {"fresh": True, "reset": False} if not invert else {"fresh": False, "reset": False}

    def callReset(classDef, invert):
        return {"fresh": False, "reset": True} if not invert else {"reset": False}

    def callStone(classDef, invert, stoneColor):
        if stoneColor == "nostone":
            return {"stone": None} if not invert else {}
        if invert:
            return {"stone": None} if classDef["stone"] == stoneColor else {}
        return {"stone": stoneColor}

    def callStoneRed(classDef, invert):
        return callStone(classDef, invert, "red")

    def callStoneBlue(classDef, invert):
        return callStone(classDef, invert, "blue")

    def callStoneYellow(classDef, invert):
        return callStone(classDef, invert, "yellow")

    def callStoneGiant(classDef, invert):
        return callStone(classDef, invert, "giant")

    def callStoneNostone(classDef, invert):
        return callStone(classDef, invert, "nostone")

    attributeCases = [
        {"attribute": "fresh", "call": callFresh},
        {"attribute": "reset", "call": callReset},
        {"attribute": "red", "call": callStoneRed},
        {"attribute": "blue", "call": callStoneBlue},
        {"attribute": "yellow", "call": callStoneYellow},
        {"attribute": "giant", "call": callStoneGiant},
        {"attribute": "nostone", "call": callStoneNostone}
    ]

    async def setAttribute(ctx, index, attribute, invert):
        setObject = {attribute: not invert}
        for attributeCase in attributeCases:
            if attributeCase["attribute"] == attribute:
                setObject = attributeCase["call"](userRaidLists[ctx.author.name][index], invert)
        
        for attributeName, attributeValue in setObject.items():
            userRaidLists[ctx.author.name][index][attributeName] = attributeValue

    async def classFound(ctx, index, realName):
        invertAttr = False
        for attribute in args:
            if attribute == 'not':
                invertAttr = True
                continue

            if not canSetAttribute(attribute):
                await ctx.send("Attribute '" + attribute + "' doesn't exist")
            
            await setAttribute(ctx, index, attribute, invertAttr)

            invertAttr = False

        await ctx.send(userListToServerList(ctx.author.name))
        saveUserFile()

    async def classNotFound(ctx, realName):
        await ctx.send(realName + " was not fount in your list")
        await ctx.send(userListToServerList(ctx.author.name))

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

@client.command()
async def run(ctx, *args):
    async def classFound(ctx, index, realName):
        if userRaidLists[ctx.author.name][index]["fresh"] == 0:
            await ctx.send("You have already run rosso on " + className)
            return

        userRaidLists[ctx.author.name][index]["fresh"] -= 1

    async def classNotFound(ctx, realName):
        await ctx.send(realName + " was not fount in your list")

    async def userNotFound(ctx, realName):
        await ctx.send("You have no list yet")

    for className in args:
        await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

    await ctx.send(userListToServerList(ctx.author.name))
    saveUserFile()

@client.command()
async def list(ctx):
    listStr = ""

    async def userFound(ctx):
        nonlocal listStr
        charList = ""
        userList = userRaidLists[ctx.author.name].copy()
        userList.sort(key = lambda charDef: findElswordClass(charDef["className"])["index"])
        for classDef in userList:
            charList += classDef["emoji"] + " "
        listStr = "Your Character(s): " + charList + "\n"

    async def userNotFound(ctx):
        await ctx.send("You have no list yet")

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)
    listStr += "List: " + userListToServerList(ctx.author.name) + "\n"
    listStr += "Raid Server List: " + userListToServerList(ctx.author.name, False)
    await ctx.send(listStr)

def printUserList(user):
    charList = ''
    for classDef in userRaidLists[user]:
        charList += classDef['className'] + ' '
    print(charList)

@client.command()
async def move(ctx, *args):
    def getActualIndexMoveTo(indexMoveTo, user):
        charList = userRaidLists[user]
        for index, classDef in enumerate(charList):
            if (index + 1 == indexMoveTo):
                return indexMoveTo
            if (not classDef['fresh'] and not classDef['reset']):
                indexMoveTo += 1
        return indexMoveTo

    classNames = args[0::2]
    positions = args[1::2]

    if (len(classNames) != len(classNames)):
        await ctx.send("Bad syntax, check the help command")
        return

    for index, className in enumerate(classNames):
        indexMoveTo = int(positions[index])
        async def classFound(ctx, index, realName):
            nonlocal indexMoveTo
            if (int(indexMoveTo) <= 0 or int(indexMoveTo) > len(userRaidLists[ctx.author.name])):
                await ctx.send("Index " + str(indexMoveTo) + " isn't in your list")
                return
            indexMoveTo = getActualIndexMoveTo(indexMoveTo, ctx.author.name)
            item = userRaidLists[ctx.author.name][index]
            del(userRaidLists[ctx.author.name][index])
            userRaidLists[ctx.author.name].insert(int(indexMoveTo) - 1, item)

        async def classNotFound(ctx, realName):
            await ctx.send(realName + " was not fount in your list")

        async def userNotFound(ctx, realName):
            await ctx.send("You have no list yet")

        await doIfClassFoundInUserList(ctx, className, classFound, classNotFound, userNotFound)

    await ctx.send(userListToServerList(ctx.author.name))
    saveUserFile()

@client.command()
async def weeklyreset(ctx):
    async def userFound(ctx):
        for index, whatever in enumerate(userRaidLists[ctx.author.name]):
            userRaidLists[ctx.author.name][index]["fresh"] = True
        await ctx.send(userListToServerList(ctx.author.name))

    async def userNotFound(ctx):
        await ctx.send("You have no list yet")

    await doIfUserFoundInUserList(ctx, userFound, userNotFound)
    saveUserFile()

@client.command()
async def on_command_error(ctx, error):
    if isinstance(error, discord.ext.commands.error.CommandNotFound):
        await ctx.send("This command doesn't exist")
    if isinstance(error, discord.ext.commands.error.MissingRequiredArgument):
        await ctx.send("Missing required argument")

if __name__ == "__main__":
    client.run('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo')