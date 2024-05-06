import React, { Component } from "react";
import PropTypes from "prop-types";
import "./PMStyle.css";

// Função React que representa um componente de tabela personalizada com funcionalidades avançadas.
// Ele recebe dados e configurações como props e gerencia o estado da tabela.
// As funções definidas aqui lidam com eventos de clique, alterações de entrada e ciclo de vida do componente.

// handleClick: Manipula a ordenação dos dados quando o cabeçalho da coluna é clicado.
// handleNextColumn: Avança para a próxima coluna quando o botão correspondente é clicado.
// handlePreviousColumn: Retrocede para a coluna anterior quando o botão correspondente é clicado.
// handleSearchInputChange: Atualiza a consulta de pesquisa e filtra os dados com base nessa consulta.
// handleRoomSelectionChange: Atualiza a sala selecionada e filtra os dados com base na sala selecionada.
// componentDidMount: Executa após a montagem do componente e realiza uma requisição para obter os dados da tabela a partir de uma API externa.

class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      header: props.header,
      data: props.data,
      sortBy: null,
      descending: false,
      error: null,
      currentColumn: 0,
      searchQuery: "",
      filteredData: props.data,
      selectedRoom: "Todas as Salas",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleNextColumn = this.handleNextColumn.bind(this);
    this.handlePreviousColumn = this.handlePreviousColumn.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleRoomSelectionChange = this.handleRoomSelectionChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch("http://localhost:3000/Agenda")
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          title: json.title,
          header: json.header,
          data: json.data,
          filteredData: json.data,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          error: "Não foi possível recuperar os dados.",
        });
      });
  }

  handleClick(event) {
    const column =
      event.target.tagName.toUpperCase() === "TH" ? event.target.cellIndex : -1;
    const data = Array.from(this.state.data);
    const descending = this.state.sortBy === column && !this.state.descending;
    data.sort((a, b) => {
      if (a[column] === b[column]) {
        return 0;
      }
      return descending
        ? a[column] < b[column]
          ? 1
          : -1
        : a[column] > b[column]
        ? 1
        : -1;
    });
    this.setState({
      data,
      sortBy: column,
      descending: descending,
      edit: {
        row: -1,
        column: -1,
      },
    });
  }

  handleNextColumn() {
    this.setState((prevState) => ({
      currentColumn: Math.min(
        prevState.currentColumn + 1,
        this.state.header.length - 1
      ),
    }));
  }

  handlePreviousColumn() {
    this.setState((prevState) => ({
      currentColumn: Math.max(prevState.currentColumn - 1, 0),
    }));
  }

  handleSearchInputChange(event) {
    const query = event.target.value.toLowerCase();
    const filteredData = this.state.data.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(query))
    );
    this.setState({ searchQuery: query, filteredData });
  }

  handleRoomSelectionChange(event) {
    const selectedRoom = event.target.value;
    this.setState({ selectedRoom });
    if (selectedRoom === "Todas as Salas") {
      this.setState({ filteredData: this.state.data });
    } else {
      const filteredData = this.state.data.filter(
        (row) => row[7] === selectedRoom
      );
      this.setState({ filteredData });
    }
  }

  render() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }

    const { title, header, currentColumn, filteredData, selectedRoom } =
      this.state;

    const roomOptions = [
      "Todas as Salas",
      "Sala 1",
      "Sala 2",
      "Sala 3",
      "Sala 4",
      "Sala 5",
      "Sala 6",
      "Sala 7",
      "Sala 8",
      "Sala 9",
      "Sala 10",
      "Sala 11",
      "Sala 12",
    ];

    return (
      <div>
        <table className="pm-table">
          <caption className="pm-caption">{title}</caption>
          <thead onClick={this.handleClick}>
            <tr>
              {header.map((label, idx) => {
                const cellClass =
                  idx !== 0 && idx !== currentColumn ? "hide-on-mobile" : "";
                return (
                  <th className={`pm-th ${cellClass}`} key={idx}>
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIdx) => {
              return (
                <tr key={rowIdx} data-row={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const cellClass =
                      colIdx !== 0 && colIdx !== currentColumn
                        ? "hide-on-mobile"
                        : "";
                    return (
                      <td
                        className={`pm-td ${cellClass}`}
                        key={colIdx}
                        onClick={this.onResetTable}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <button
                  className="hide-on-desktop pm-button"
                  onClick={this.handlePreviousColumn}
                >
                  Anterior
                </button>
                <button
                  className="hide-on-desktop pm-button"
                  onClick={this.handleNextColumn}
                >
                  Próximo
                </button>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="room-dropdown">
          <select
            value={selectedRoom}
            onChange={this.handleRoomSelectionChange}
          >
            {roomOptions.map((room, index) => (
              <option key={index} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={this.state.searchQuery}
          onChange={this.handleSearchInputChange}
          placeholder="Pesquise aqui:"
          className="pm-input"
        />
      </div>
    );
  }
}

CustomTable.propTypes = {
  title: PropTypes.string.isRequired,
  header: PropTypes.array,
  data: PropTypes.array,
};

CustomTable.defaultProps = {
  title: "Table",
  header: [],
  data: [],
};

export default CustomTable;
