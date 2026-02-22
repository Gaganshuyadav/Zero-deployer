import { prisma } from "../DB/prisma-client/PrismaClient.js";
import type { TeamFindManyArgs } from "../generated/prisma/models.js";
import type { CreateNewTeamBody } from "../types/req-body/team.js";


class TeamService{

    public createNewTeam = async ( body:CreateNewTeamBody, user_id:string):Promise<any> =>{

        const newTeam = await prisma.team.create({
            data: {
                name: body.name,
                type: body.type || "HOBBY",
                user_id: user_id
            }
        })

        return newTeam;
    }

    public  getTeamById = async ( teamId:string)=>{

        return await prisma.team.findUnique({ where: { id: teamId}});
    }

    

    public  getTeamByuserId = async ( {userId, page, limit}:{ userId:string, page?:number, limit?:number} ) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }
            
        }

        let teamsData;

        if( paginationQuery){
            teamsData = await prisma.team.findMany({
                where: {
                    user_id: userId
                },
                ...paginationQuery
            })
        }
        else{
            teamsData = await prisma.team.findMany({
                where: {
                    user_id: userId
                }
            })
        }

        return teamsData;

    }

    public IsTeamExist = async ( id:string):Promise<boolean> =>{

        const findTeam = await prisma.team.findUnique({
            where: {
                id
            }
        });

        return findTeam ? true : false;
    }

    public  getAllTeams =  async ( query?:TeamFindManyArgs ,page?:number, limit?:number) =>{

        let skip, paginationQuery;
        if( page && limit){
            skip = ( page-1)*limit;

            paginationQuery = {
                skip: skip,
                take: limit
            }
            
        }

        let allTeamsData;

        if( paginationQuery){
            allTeamsData = await prisma.team.findMany({
                ...paginationQuery,
                ...query
            })
        }
        else{
            allTeamsData = await prisma.team.findMany({
                ...query
            })
        }

        return allTeamsData;
    }


}

const teamService = new TeamService();

export { teamService};