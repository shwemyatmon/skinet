using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository
        ,IMapper mapper)
        {
            _mapper = mapper;
            _basketRepository = basketRepository;
        }
    [HttpGet]
    public async Task<ActionResult<CustomerBasket>> GetBasektById(string Id)
    {
        var basket = await _basketRepository.GetBasketAsync(Id);
        return Ok(basket ?? new CustomerBasket(Id));
    }

    [HttpPost]
    public async Task<ActionResult<CustomerBasketDto>> UpdateBasket(CustomerBasketDto basket)
    {        
        var customerbasket = _mapper.Map<CustomerBasketDto,CustomerBasket>(basket);
        
        var updatedBasket = await _basketRepository.UpdateBasketAsync(customerbasket);

        return Ok(updatedBasket);

    }

    [HttpDelete]
    public async Task DeleteBasket(string Id)
    {
        await _basketRepository.DeleteBasketAsync(Id);
    }
}
}