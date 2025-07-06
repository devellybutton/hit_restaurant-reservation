import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtPayload } from 'src/auth/dtos';
import { RestaurantAuthGuard } from 'src/auth/guards/restaurant-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MenuFilterForm, CreateMenuForm } from './forms';
import { MenuResponseDto } from './dtos';
import { MenuCategory } from './enums';

@ApiTags('Menu')
@ApiBearerAuth()
@UseGuards(RestaurantAuthGuard)
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 메뉴 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '메뉴 목록 조회',
    description: '로그인한 식당의 메뉴 목록을 조회한다. 이름, 가격, 카테고리로 필터링할 수 있다.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '메뉴 이름 부분 검색',
    example: '김치',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: '최소 가격',
    example: 5000,
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: '최대 가격',
    example: 20000,
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '카테고리 필터',
    enum: MenuCategory,
    example: MenuCategory.CHINESE,
  })
  @ApiResponse({
    status: 200,
    description: '메뉴 목록 조회 성공',
    type: [MenuResponseDto],
    example: [
      {
        id: 1,
        name: '짬뽕',
        price: 8000,
        category: '중식',
        description: '얼큰하고 진한 국물의 해산물 짬뽕',
        restaurantName: '맛있는 중식당',
        createdAt: '2025-07-06T18:00:00.000Z',
        updatedAt: '2025-07-06T18:00:00.000Z',
      },
    ],
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 - 로그인 필요',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 식당 권한 필요',
    example: {
      statusCode: 403,
      message: '식당 권한이 필요합니다.',
      error: 'Forbidden',
    },
  })
  async getMenus(
    @Request() req: { user: JwtPayload },
    @Query() filters: MenuFilterForm,
  ): Promise<MenuResponseDto[]> {
    return await this.menuService.getMenus(req.user, filters);
  }

  /**
   * 메뉴 생성
   */
  @Post()
  @ApiOperation({
    summary: '메뉴 추가',
    description: '새로운 메뉴를 추가한다. 식당 권한이 필요하다.',
  })
  @ApiResponse({
    status: 201,
    description: '메뉴 추가 성공',
    type: MenuResponseDto,
    example: {
      id: 1,
      name: '짬뽕',
      price: 8000,
      category: '중식',
      description: '얼큰하고 진한 국물의 해산물 짬뽕',
      restaurantName: '맛있는 중식당',
      createdAt: '2025-07-06T18:00:00.000Z',
      updatedAt: '2025-07-06T18:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 형식',
    example: {
      statusCode: 400,
      message: ['name should not be empty', 'price must be a positive number'],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 식당 권한 필요',
  })
  async createMenu(
    @Request() req: { user: JwtPayload },
    @Body() createMenuForm: CreateMenuForm,
  ): Promise<MenuResponseDto> {
    return await this.menuService.createMenu(req.user, createMenuForm);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '메뉴 삭제',
    description: '메뉴를 삭제한다. 본인 식당의 메뉴만 삭제 가능하다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 메뉴 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '메뉴 삭제 성공',
    example: {
      message: '메뉴가 성공적으로 삭제되었습니다.',
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 메뉴 ID',
    example: {
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 본인 식당의 메뉴만 삭제 가능',
    example: {
      statusCode: 403,
      message: '본인 식당의 메뉴만 삭제할 수 있습니다.',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: '메뉴를 찾을 수 없음',
    example: {
      statusCode: 404,
      message: '메뉴를 찾을 수 없습니다.',
      error: 'Not Found',
    },
  })
  async deleteMenu(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.menuService.deleteMenu(req.user, id);
    return { message: '메뉴가 성공적으로 삭제되었습니다.' };
  }
}
