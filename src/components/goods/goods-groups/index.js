import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as goodsGroupsActions from './../../../actions/goods-groups';
import * as goodsActions from './../../../actions/goods';
import { getGoodsGroupsByIds } from './../../../store/reducers/goods-groups';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import './style.css';

import IconButton from 'material-ui/IconButton';
import IconClear from 'material-ui/svg-icons/content/clear';

const GoodsGroups =  ({
  items,
  filters,
  goodsGroupsSelected,
  current,
  categoryLineSeparator,
  // actions
  search,
  filterGoodsGroupsByText,
  addFilter,
  removeFilter,
  resetFilters,
  handleClick
}) => {
  let searchRef;
  const style = {
    flex: '1 0 auto',
    padding: '10px',
    height: '30vh',
    overflowY: 'scroll',
    paddingTop: '3px'
  };

  let clearFilterStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    marginTop: '4px'
  }
  clearFilterStyle = categoryLineSeparator ? { ...clearFilterStyle, borderBottom: '1px solid #eee' } : clearFilterStyle;

  let categoryItemStyle = {
    fontSize: '13px'
  }
  categoryItemStyle = categoryLineSeparator ? { ...categoryItemStyle, borderBottom: '1px solid #eee' } : categoryItemStyle;

  const innerListItemStyle = {
    padding: '5px 10px 5px 10px'
  };

  const getItemsStyledJsx = () => {
    const keys = Object.keys(items);
    return keys.map( key => {
        const qtySelected = goodsGroupsSelected[key] ? '( ' + goodsGroupsSelected[key] + ' ) ' : '';
        return (
          <ListItem
            innerDivStyle={innerListItemStyle}
            style={categoryItemStyle}
            key={key}
            primaryText={qtySelected + items[key]}
            onClick={
              e => {
                handleClick(key);
                // addFilter(key);
                // search();
              }
            }
          />
        );
    });
  };

  const filterStyle = {
    margin: 2,
    height: '24px',
    justifyContent: 'space-between',
    maxWidth: '100%',
    whiteSpace: 'initial'
  };

  const filterLabelStyle = {
    fontSize: '12px',
    lineHeight: '24px',
    maxWidth: '90%',
    overflow: 'hidden',
    whiteSpace: 'initial'
  };

  const getFilterItemJsx = (filterKey, filterDescr) => {
    return (
      <Chip
        className='goodsGroupChip'
        key={filterKey}
        onRequestDelete={
          () => {
            removeFilter(filterKey);
            search();
          }
        }
        style={filterStyle}
        labelStyle={filterLabelStyle}
      >
        {filterDescr}
      </Chip>
    );
  };

  const getFiltersJsx = () => {
    return Object.keys(filters).map(filterKey => getFilterItemJsx(filterKey, filters[filterKey]));
  };

  return (
    <Paper className='goodsCategories' style={style} rounded={false} zDepth={2}>
      <List>
        <div style={{paddingLeft: '10px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <TextField
              placeholder='фильтр категорий'
              className='search'
              id='searchGoodsGroups'
              type="text"
              ref={
                node => {
                  searchRef = node;
                }
              }
              onChange={
                e => {
                  filterGoodsGroupsByText(e.target.value.trim());
                }
              }
            />
            <IconButton
              style={{height: '32px', width: '32px', padding: '2px'}}
              onClick={
                () => {
                  if (searchRef.input.value.trim() === '') {
                    resetFilters();
                    search();
                  } else {
                      searchRef.input.value = '';
                    filterGoodsGroupsByText('');
                  }
                }
              }
            >
              <IconClear />
            </IconButton>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {getFiltersJsx()}
          </div>
        </div>
        <ListItem
          innerDivStyle={{padding: '5px 10px 5px 10px'}}
          style={clearFilterStyle}
          key={9999}
          primaryText='Все категории'
          onClick={
            () => {
              resetFilters();
              search();
            }
          }
        />
        {getItemsStyledJsx()}
      </List>
    </Paper>
  );
};

// export default connect(
//   state => {
//     const items = state.goodsGroups.items;
//     const filters = getGoodsGroupsByIds(state.goodsGroups.itemsInitial, state.goodsGroups.filtersIds);
//     const current = state.current;
//     const categoryLineSeparator = state.options.categoryLineSeparator;
//     const goodsGroupsSelected = state.goodsGroupsSelected;
//     return { items, filters, current, categoryLineSeparator, goodsGroupsSelected };
//   },
//   { ...goodsGroupsActions, ...goodsActions }
// )(GoodsGroups);

class GoodsGroupsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { clickTime: 0 };
  }

  handleClick = key => {
    const newClickTime = new Date();
    if (newClickTime - this.state.clickTime > 500) {
      setTimeout( () => {
        const dateNew = new Date();
        const dateOld = this.state.clickTime;
        const clickType = dateNew - dateOld > 499 ? 'single' : 'double';
        if (clickType === 'double') {
          this.props.resetFilters();
        }
        this.props.addFilter(key);
        this.props.search();

        this.setState({ clickTime: dateNew });
      }, 500);
    }
    this.setState({ clickTime: newClickTime });
  }

  render() {
    return <GoodsGroups {...this.props} handleClick={this.handleClick} />
  }

}

export default connect(
  state => {
    const items = state.goodsGroups.items;
    const filters = getGoodsGroupsByIds(state.goodsGroups.itemsInitial, state.goodsGroups.filtersIds);
    const current = state.current;
    const categoryLineSeparator = state.options.categoryLineSeparator;
    const goodsGroupsSelected = state.goodsGroupsSelected;
    return { items, filters, current, categoryLineSeparator, goodsGroupsSelected };
  },
  { ...goodsGroupsActions, ...goodsActions }
)(GoodsGroupsContainer);
