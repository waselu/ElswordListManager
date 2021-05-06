import discord
from discord.ext import commands
import sys
import json
import pyperclip

##Usable by other users##
#TODO: help command
#TODO: sort (autosort) command

##Mandatory##

##LONG TERM##
#TODO: set/addlist command (example: setlist cl sage reset ke dps tw yellow)

##Propreté du code##
#TODO: rework set array

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
    #Gear attributes
    {"name": "dps", "value": False, "canSet": True, "isDefault": True,  "emoji": "<:dps:828908669978673182>", "serverEmoji": "dps"},
    {"name": "sage", "value": False, "canSet": True, "isDefault": True, "emoji": "<:sage:828908664810373130>", "serverEmoji": "FullSage"},
    {"name": "speed", "value": False, "canSet": True, "isDefault": True, "emoji": "<:SpdBot:837244319726436372>", "serverEmoji": "SpdBot"},

    #Canrun attributes
    {"name": "fresh", "value": True, "canSet": True, "isDefault": True, "emoji": "<:fresh:828908656144678964>", "serverEmoji": "fresh"},
    {"name": "reset", "value": False, "canSet": True, "isDefault": True, "emoji": "<:reset:832571110906003496>", "serverEmoji": "reset"},
    {"name": "flamemark", "value": False, "canSet": False, "isDefault": False, "emoji": "<:flamemark:828910673626923038>", "serverEmoji": "flamemark"},

    #Stone attributes
    {"name": "stone", "value": None, "canSet": False, "isDefault": True, "emoji": "", "serverEmoji": ""}, #attribute
    {"name": "red", "value": None, "canSet": True, "isDefault": False, "emoji": "<:redcrystal:830525849391464511>", "serverEmoji": "redcrystal"},
    {"name": "blue", "value": None, "canSet": True, "isDefault": False, "emoji": "<:bluecrystal:830525860418551899>", "serverEmoji": "bluecrystal"},
    {"name": "yellow", "value": None, "canSet": True, "isDefault": False, "emoji": "<:yellowcrystal:830525869487161354>", "serverEmoji": "yellowcrystal"},
    {"name": "giant", "value": None, "canSet": True, "isDefault": False, "emoji": "<:giantcrystal:830525874007965766>", "serverEmoji": "giantcrystal"},
    {"name": "nostone", "value": None, "canSet": True, "isDefault": False, "emoji": "", "serverEmoji": ""},

    #Internal attributes
    {"name": "farm", "value": False, "canSet": True, "isDefault": True, "emoji": "🌾", "serverEmoji": ""},
    {"name": "break", "value": False, "canSet": True, "isDefault": True, "emoji": "⤵️", "serverEmoji": "break"},
    {"name": "alias", "value": None, "canSet": True, "isDefault": True, "emoji": "", "serverEmoji": ""}
]

userRaidLists = {   
}

@client.command()
async def set(ctx, className, *args):
    def callFresh(ctx, classDef, invert, args, indexArg):
        return {"fresh": True, "reset": False} if not invert else {"fresh": False, "reset": False}

    def callReset(ctx, classDef, invert, args, indexArg):
        return {"fresh": False, "reset": True} if not invert else {"reset": False}

    def callStone(ctx, classDef, invert, stoneColor):
        if stoneColor == "nostone":
            return {"stone": None} if not invert else {}
        if invert:
            return {"stone": None} if classDef["stone"] == stoneColor else {}
        return {"stone": stoneColor}

    def callStoneRed(ctx, classDef, invert, args, indexArg):
        return callStone(ctx, classDef, invert, "red")

    def callStoneBlue(ctx, classDef, invert, args, indexArg):
        return callStone(ctx, classDef, invert, "blue")

    def callStoneYellow(ctx, classDef, invert, args, indexArg):
        return callStone(ctx, classDef, invert, "yellow")

    def callStoneGiant(ctx, classDef, invert, args, indexArg):
        return callStone(ctx, classDef, invert, "giant")

    def callStoneNostone(ctx, classDef, invert, args, indexArg):
        return callStone(ctx, classDef, invert, "nostone")

    def callAlias(ctx, classDef, invert, args, indexArg):
        if invert:
            return {"alias": None}
        if (indexArg == len(args) - 1):
            return {"error": "No alias specified"}
        if (checkUserListHasChar(ctx.author.name, args[indexArg + 1]) != -1):
            return {"error": "You already have a character named " + args[indexArg + 1]}
        return {"alias": args[indexArg + 1], "skip": 1}

    attributeCases = [
        {"attribute": "fresh", "call": callFresh},
        {"attribute": "reset", "call": callReset},
        {"attribute": "red", "call": callStoneRed},
        {"attribute": "blue", "call": callStoneBlue},
        {"attribute": "yellow", "call": callStoneYellow},
        {"attribute": "giant", "call": callStoneGiant},
        {"attribute": "nostone", "call": callStoneNostone},
        {"attribute": "alias", "call": callAlias}
    ]

    async def setAttribute(ctx, index, attribute, invert, args, indexArg):
        setObject = {attribute: not invert}
        skip = 0
        for attributeCase in attributeCases:
            if attributeCase["attribute"] == attribute:
                setObject = attributeCase["call"](ctx, userRaidLists[ctx.author.name][index], invert, args, indexArg)
                if 'skip' in setObject:
                    skip = setObject['skip']
                    del setObject['skip']
                if 'error' in setObject:
                    await ctx.send(setObject['error'])
                    return -1
        
        for attributeName, attributeValue in setObject.items():
            userRaidLists[ctx.author.name][index][attributeName] = attributeValue

        return skip

    async def classFound(ctx, index, realName):
        invertAttr = False
        skip = 0
        for indexArg, attribute in enumerate(args):
            if (skip > 0):
                skip -= 1
                continue

            if attribute == 'not' or attribute == 'no':
                invertAttr = True
                continue

            if not canSetAttribute(attribute):
                await ctx.send("Attribute '" + attribute + "' doesn't exist")
                return
            
            skip = await setAttribute(ctx, index, attribute, invertAttr, args, indexArg)
            if skip == -1:
                return

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
async def move(ctx, *args):
    def getActualIndexMoveTo(indexMoveTo, user):
        charList = userRaidLists[user]
        for index, classDef in enumerate(charList):
            if (index + 1 == indexMoveTo):
                return indexMoveTo
            if (not classDef['fresh'] and not classDef['reset'] and not classDef['farm']):
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