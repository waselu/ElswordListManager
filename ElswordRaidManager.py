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