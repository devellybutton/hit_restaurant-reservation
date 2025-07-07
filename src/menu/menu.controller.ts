import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ErrorResponseDto,
  RESPONSE_MESSAGES,
  ResponseUtil,
  SuccessResponseDto,
} from 'src/util/responses';

@ApiTags('Menu')
@ApiBearerAuth('access-token')
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
  @ApiResponse({ status: 200, description: '메뉴 목록 조회 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  async getMenus(
    @Request() req: { user: JwtPayload },
    @Query() filters: MenuFilterForm,
  ): Promise<SuccessResponseDto<MenuResponseDto[]>> {
    const menus = await this.menuService.getMenus(req.user, filters);
    return ResponseUtil.success(menus, RESPONSE_MESSAGES.MENU_LIST_RETRIEVED);
  }

  /**
   * 메뉴 생성
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '메뉴 추가',
    description: '새로운 메뉴를 추가한다. 식당 권한이 필요하다.',
  })
  @ApiResponse({ status: 201, description: '메뉴 추가 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  async createMenu(
    @Request() req: { user: JwtPayload },
    @Body() createMenuForm: CreateMenuForm,
  ): Promise<SuccessResponseDto<MenuResponseDto>> {
    const menus = await this.menuService.createMenu(req.user, createMenuForm);
    return ResponseUtil.success(menus, RESPONSE_MESSAGES.MENU_CREATED);
  }

  /**
   * 메뉴 삭제
   */
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
  @ApiResponse({ status: 200, description: '메뉴 삭제 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 ID', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '메뉴 없음', type: ErrorResponseDto })
  async deleteMenu(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto> {
    await this.menuService.deleteMenu(req.user, id);
    return ResponseUtil.success(RESPONSE_MESSAGES.MENU_DELETED);
  }
}
